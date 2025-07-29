#!/usr/bin/env dart

import 'dart:io';
import 'dart:convert';

/// 코드 품질 자동 수정 스크립트
/// 주요 문제들을 일괄적으로 수정합니다.
void main() async {
  print('🔧 코드 품질 자동 수정 시작...\n');
  
  final fixes = [
    FixInfo('문자열 따옴표 통일', 'double quotes → single quotes', fixStringQuotes),
    FixInfo('print 문을 logger로 변경', 'print → logger', fixPrintStatements),
    FixInfo('불필요한 this 제거', 'unnecessary this', fixUnnecessaryThis),
    FixInfo('final 변수 추가', 'local variables → final', fixFinalVariables),
    FixInfo('const 생성자 추가', 'constructor → const', fixConstConstructors),
    FixInfo('사용하지 않는 import 제거', 'unused imports', fixUnusedImports),
    FixInfo('super parameters 사용', 'parameters → super parameters', fixSuperParameters),
  ];
  
  for (final fix in fixes) {
    print('📝 ${fix.name} 수정 중...');
    await fix.function();
    print('✅ ${fix.description} 완료\n');
  }
  
  print('🎉 모든 수정 완료!');
  print('다음 명령어로 결과를 확인하세요:');
  print('fvm flutter analyze');
}

class FixInfo {
  final String name;
  final String description;
  final Future<void> Function() function;
  
  FixInfo(this.name, this.description, this.function);
}

/// 문자열 따옴표 통일 (double → single)
Future<void> fixStringQuotes() async {
  final files = await findDartFiles();
  
  for (final file in files) {
    final content = await File(file).readAsString();
    final modified = content
        .replaceAllMapped(
          RegExp(r'"(.*?)"'),
          (match) {
            final text = match.group(1)!;
            // 이미 single quote가 있거나 특수한 경우는 제외
            if (text.contains("'") || 
                text.contains('\$') ||
                text.contains('\\') ||
                text.startsWith('http') ||
                text.contains('\\n')) {
              return match.group(0)!;
            }
            return "'$text'";
          },
        );
    
    if (content != modified) {
      await File(file).writeAsString(modified);
      print('  - $file 수정됨');
    }
  }
}

/// print 문을 logger로 변경
Future<void> fixPrintStatements() async {
  final files = await findDartFiles();
  
  for (final file in files) {
    final content = await File(file).readAsString();
    
    // logger import가 없으면 추가
    if (content.contains('print(') && !content.contains('import.*logger')) {
      final modified = content.replaceFirst(
        RegExp(r'import.*?;'),
        '\$&import \'package:logger/logger.dart\';\n',
      );
      await File(file).writeAsString(modified);
    }
    
    // print 문을 logger로 변경
    final modified = content
        .replaceAll('print(', '_logger.d(')
        .replaceAll('print(\'[', '_logger.d(\'[')
        .replaceAll('print("[', '_logger.d(\'[');
    
    if (content != modified) {
      await File(file).writeAsString(modified);
      print('  - $file 수정됨');
    }
  }
}

/// 불필요한 this 제거
Future<void> fixUnnecessaryThis() async {
  final files = await findDartFiles();
  
  for (final file in files) {
    final content = await File(file).readAsString();
    final modified = content
        .replaceAll('this.', '')
        .replaceAll('this,', ',');
    
    if (content != modified) {
      await File(file).writeAsString(modified);
      print('  - $file 수정됨');
    }
  }
}

/// final 변수 추가
Future<void> fixFinalVariables() async {
  final files = await findDartFiles();
  
  for (final file in files) {
    final content = await File(file).readAsString();
    final modified = content
        .replaceAllMapped(
          RegExp(r'(\s+)(\w+)\s+(\w+)\s*=\s*([^;]+);'),
          (match) {
            final indent = match.group(1)!;
            final type = match.group(2)!;
            final name = match.group(3)!;
            final value = match.group(4)!;
            
            // 이미 final이거나 특수한 경우는 제외
            if (type == 'final' || type == 'const' || type == 'var') {
              return match.group(0)!;
            }
            
            return '\$indentfinal \$type \$name = \$value;';
          },
        );
    
    if (content != modified) {
      await File(file).writeAsString(modified);
      print('  - $file 수정됨');
    }
  }
}

/// const 생성자 추가
Future<void> fixConstConstructors() async {
  final files = await findDartFiles();
  
  for (final file in files) {
    final content = await File(file).readAsString();
    final modified = content
        .replaceAllMapped(
          RegExp(r'(\s+)(\w+\([^)]*\))'),
          (match) {
            final indent = match.group(1)!;
            final constructor = match.group(2)!;
            
            // 이미 const가 있거나 특수한 경우는 제외
            if (constructor.contains('const ') || 
                constructor.contains('new ') ||
                constructor.contains('super(')) {
              return match.group(0)!;
            }
            
            return '\$indentconst \$constructor';
          },
        );
    
    if (content != modified) {
      await File(file).writeAsString(modified);
      print('  - $file 수정됨');
    }
  }
}

/// 사용하지 않는 import 제거
Future<void> fixUnusedImports() async {
  final files = await findDartFiles();
  
  for (final file in files) {
    final content = await File(file).readAsString();
    final lines = content.split('\n');
    final modifiedLines = <String>[];
    
    for (final line in lines) {
      if (line.trim().startsWith('import ') && 
          (line.contains('dio/dio.dart') || 
           line.contains('unused') ||
           line.contains('duplicate'))) {
        continue; // 제거
      }
      modifiedLines.add(line);
    }
    
    final modified = modifiedLines.join('\n');
    if (content != modified) {
      await File(file).writeAsString(modified);
      print('  - $file 수정됨');
    }
  }
}

/// super parameters 사용
Future<void> fixSuperParameters() async {
  final files = await findDartFiles();
  
  for (final file in files) {
    final content = await File(file).readAsString();
    final modified = content
        .replaceAllMapped(
          RegExp(r'(\w+\([^)]*\)\s*:\s*super\()([^)]+)(\)\s*,\s*this\.)([^)]+)(\))'),
          (match) {
            final prefix = match.group(1)!;
            final superParams = match.group(2)!;
            final thisPrefix = match.group(3)!;
            final thisParams = match.group(4)!;
            final suffix = match.group(5)!;
            
            return '$prefix$superParams, $thisParams$suffix';
          },
        );
    
    if (content != modified) {
      await File(file).writeAsString(modified);
      print('  - $file 수정됨');
    }
  }
}

/// Dart 파일 찾기
Future<List<String>> findDartFiles() async {
  final result = await Process.run('find', ['lib', '-name', '*.dart']);
  final files = (result.stdout as String).trim().split('\n');
  return files.where((file) => file.isNotEmpty).toList();
} 