export interface BundleInfo {
  name: string;
  size: number;
  gzippedSize?: number;
  dependencies: string[];
  chunks: string[];
}

export interface BundleReport {
  totalSize: number;
  totalGzippedSize?: number;
  bundles: BundleInfo[];
  largestBundles: BundleInfo[];
  duplicateModules: string[];
  optimizationSuggestions: string[];
}

export interface OptimizationConfig {
  enableBundleAnalysis: boolean;
  enableCodeSplitting: boolean;
  enableTreeShaking: boolean;
  enableCompression: boolean;
  enableCaching: boolean;
  chunkSizeLimit: number; // bytes
}

export class BundleAnalyzer {
  private static instance: BundleAnalyzer;
  private config: OptimizationConfig;

  private constructor(config: Partial<OptimizationConfig> = {}) {
    this.config = {
      enableBundleAnalysis: true,
      enableCodeSplitting: true,
      enableTreeShaking: true,
      enableCompression: true,
      enableCaching: true,
      chunkSizeLimit: 244 * 1024, // 244KB
      ...config,
    };
  }

  static getInstance(config?: Partial<OptimizationConfig>): BundleAnalyzer {
    if (!BundleAnalyzer.instance) {
      BundleAnalyzer.instance = new BundleAnalyzer(config);
    }
    return BundleAnalyzer.instance;
  }

  /**
   * 번들 크기 분석
   */
  analyzeBundleSize(bundleData: any): BundleReport {
    const bundles: BundleInfo[] = [];
    let totalSize = 0;
    let totalGzippedSize = 0;

    // 번들 정보 추출
    if (bundleData && bundleData.chunks) {
      bundleData.chunks.forEach((chunk: any) => {
        const bundleInfo: BundleInfo = {
          name: chunk.name || 'unknown',
          size: chunk.size || 0,
          gzippedSize: chunk.gzippedSize,
          dependencies: chunk.dependencies || [],
          chunks: chunk.chunks || [],
        };

        bundles.push(bundleInfo);
        totalSize += bundleInfo.size;
        if (bundleInfo.gzippedSize) {
          totalGzippedSize += bundleInfo.gzippedSize;
        }
      });
    }

    // 가장 큰 번들들 찾기
    const largestBundles = [...bundles]
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);

    // 중복 모듈 찾기
    const duplicateModules = this.findDuplicateModules(bundles);

    // 최적화 제안 생성
    const optimizationSuggestions = this.generateOptimizationSuggestions(
      bundles,
      largestBundles,
      duplicateModules
    );

    return {
      totalSize,
      totalGzippedSize: totalGzippedSize > 0 ? totalGzippedSize : undefined,
      bundles,
      largestBundles,
      duplicateModules,
      optimizationSuggestions,
    };
  }

  /**
   * 코드 스플리팅 제안
   */
  suggestCodeSplitting(bundles: BundleInfo[]): string[] {
    const suggestions: string[] = [];

    // 큰 번들에 대한 동적 임포트 제안
    bundles
      .filter(bundle => bundle.size > this.config.chunkSizeLimit)
      .forEach(bundle => {
        suggestions.push(
          `Consider code splitting for bundle "${bundle.name}" (${this.formatSize(bundle.size)})`
        );
      });

    // 라우트 기반 스플리팅 제안
    if (bundles.some(b => b.name.includes('main'))) {
      suggestions.push(
        'Implement route-based code splitting using React.lazy()'
      );
    }

    // 컴포넌트 기반 스플리팅 제안
    suggestions.push(
      'Use dynamic imports for large components: React.lazy(() => import("./Component"))'
    );

    return suggestions;
  }

  /**
   * 트리 셰이킹 최적화 제안
   */
  suggestTreeShaking(): string[] {
    return [
      'Use ES6 modules (import/export) instead of CommonJS (require/module.exports)',
      'Ensure all dependencies support tree shaking',
      'Use named imports instead of default imports when possible',
      'Avoid importing entire libraries, import specific functions instead',
      'Use "sideEffects: false" in package.json for pure modules',
    ];
  }

  /**
   * 캐싱 최적화 제안
   */
  suggestCachingOptimization(bundles: BundleInfo[]): string[] {
    const suggestions: string[] = [
      'Use content hashing in bundle filenames for better caching',
      'Implement long-term caching for vendor bundles',
      'Use runtime chunk for webpack manifest',
      'Consider using Service Workers for offline caching',
    ];

    // 벤더 번들 분리 제안
    if (bundles.some(b => b.name.includes('vendor'))) {
      suggestions.push(
        'Vendor bundle detected - ensure it has proper caching headers'
      );
    }

    return suggestions;
  }

  /**
   * 압축 최적화 제안
   */
  suggestCompressionOptimization(): string[] {
    return [
      'Enable gzip compression on server',
      'Enable Brotli compression for better compression ratios',
      'Use TerserPlugin for JavaScript minification',
      'Optimize images and use WebP format',
      'Minimize CSS using cssnano or similar tools',
    ];
  }

  /**
   * 성능 메트릭 분석
   */
  analyzePerformanceMetrics(metrics: any): {
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    firstInputDelay?: number;
    cumulativeLayoutShift?: number;
    suggestions: string[];
  } {
    const suggestions: string[] = [];

    // First Contentful Paint 분석
    if (metrics.firstContentfulPaint) {
      if (metrics.firstContentfulPaint > 2000) {
        suggestions.push(
          'First Contentful Paint is slow (>2s). Consider optimizing critical rendering path'
        );
      }
    }

    // Largest Contentful Paint 분석
    if (metrics.largestContentfulPaint) {
      if (metrics.largestContentfulPaint > 2500) {
        suggestions.push(
          'Largest Contentful Paint is slow (>2.5s). Optimize largest content element'
        );
      }
    }

    // First Input Delay 분석
    if (metrics.firstInputDelay) {
      if (metrics.firstInputDelay > 100) {
        suggestions.push(
          'First Input Delay is high (>100ms). Reduce JavaScript execution time'
        );
      }
    }

    // Cumulative Layout Shift 분석
    if (metrics.cumulativeLayoutShift) {
      if (metrics.cumulativeLayoutShift > 0.1) {
        suggestions.push(
          'Cumulative Layout Shift is high (>0.1). Fix layout shifts'
        );
      }
    }

    return {
      firstContentfulPaint: metrics.firstContentfulPaint,
      largestContentfulPaint: metrics.largestContentfulPaint,
      firstInputDelay: metrics.firstInputDelay,
      cumulativeLayoutShift: metrics.cumulativeLayoutShift,
      suggestions,
    };
  }

  /**
   * 번들 크기 포맷팅
   */
  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 중복 모듈 찾기
   */
  private findDuplicateModules(bundles: BundleInfo[]): string[] {
    const moduleCount: Record<string, number> = {};
    const duplicates: string[] = [];

    bundles.forEach(bundle => {
      bundle.dependencies.forEach(dep => {
        moduleCount[dep] = (moduleCount[dep] || 0) + 1;
      });
    });

    Object.entries(moduleCount).forEach(([module, count]) => {
      if (count > 1) {
        duplicates.push(`${module} (${count} times)`);
      }
    });

    return duplicates;
  }

  /**
   * 최적화 제안 생성
   */
  private generateOptimizationSuggestions(
    bundles: BundleInfo[],
    largestBundles: BundleInfo[],
    duplicateModules: string[]
  ): string[] {
    const suggestions: string[] = [];

    // 큰 번들 제안
    if (largestBundles.length > 0) {
      suggestions.push(
        `Largest bundle: ${largestBundles[0].name} (${this.formatSize(largestBundles[0].size)})`
      );
    }

    // 중복 모듈 제안
    if (duplicateModules.length > 0) {
      suggestions.push(`Found ${duplicateModules.length} duplicate modules`);
    }

    // 코드 스플리팅 제안
    suggestions.push(...this.suggestCodeSplitting(bundles));

    // 트리 셰이킹 제안
    suggestions.push(...this.suggestTreeShaking());

    // 캐싱 제안
    suggestions.push(...this.suggestCachingOptimization(bundles));

    // 압축 제안
    suggestions.push(...this.suggestCompressionOptimization());

    return suggestions;
  }

  /**
   * 설정 업데이트
   */
  updateConfig(config: Partial<OptimizationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 최적화 상태 확인
   */
  getOptimizationStatus(): {
    bundleAnalysis: boolean;
    codeSplitting: boolean;
    treeShaking: boolean;
    compression: boolean;
    caching: boolean;
  } {
    return {
      bundleAnalysis: this.config.enableBundleAnalysis,
      codeSplitting: this.config.enableCodeSplitting,
      treeShaking: this.config.enableTreeShaking,
      compression: this.config.enableCompression,
      caching: this.config.enableCaching,
    };
  }
}

// 편의 함수들
export const bundleAnalyzer = BundleAnalyzer.getInstance();

export const analyzeBundle = (bundleData: any) =>
  bundleAnalyzer.analyzeBundleSize(bundleData);
export const formatSize = (bytes: number) => bundleAnalyzer.formatSize(bytes);
export const suggestCodeSplitting = (bundles: BundleInfo[]) =>
  bundleAnalyzer.suggestCodeSplitting(bundles);

export default BundleAnalyzer;
