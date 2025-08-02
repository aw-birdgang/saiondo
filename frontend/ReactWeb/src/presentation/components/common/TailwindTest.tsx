import React from 'react';

export const TailwindTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-txt p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">Tailwind CSS Test</h1>
        
        {/* Color Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Primary Colors</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="bg-primary text-on-primary p-4 rounded-lg">Primary Background</div>
              <div className="bg-primary-container text-on-primary p-4 rounded-lg">Primary Container</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Secondary Colors</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="bg-secondary text-on-secondary p-4 rounded-lg">Secondary Background</div>
              <div className="bg-secondary-container text-on-secondary p-4 rounded-lg">Secondary Container</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Surface Colors</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="bg-surface text-on-surface p-4 rounded-lg">Surface Background</div>
              <div className="bg-bg text-txt p-4 rounded-lg">Background</div>
            </div>
          </div>
        </div>

        {/* Button Tests */}
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Button Components</h3>
          </div>
          <div className="card-body space-y-4">
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-primary">Primary Button</button>
              <button className="btn btn-secondary">Secondary Button</button>
              <button className="btn btn-outline">Outline Button</button>
            </div>
          </div>
        </div>

        {/* Input Tests */}
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Input Components</h3>
          </div>
          <div className="card-body space-y-4">
            <input type="text" placeholder="Normal input" className="input" />
            <input type="text" placeholder="Focused input" className="input" />
            <input type="text" placeholder="Error input" className="input error" />
          </div>
        </div>

        {/* Spacing and Layout Tests */}
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Spacing & Layout</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-primary p-4 rounded-lg text-on-primary text-center">xs: 4px</div>
              <div className="bg-secondary p-6 rounded-lg text-on-secondary text-center">sm: 8px</div>
              <div className="bg-surface p-8 rounded-lg text-on-surface text-center">md: 16px</div>
              <div className="bg-primary p-10 rounded-lg text-on-primary text-center">lg: 24px</div>
            </div>
          </div>
        </div>

        {/* Typography Tests */}
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Typography</h3>
          </div>
          <div className="card-body space-y-4">
            <h1 className="text-4xl">Heading 1 (4xl)</h1>
            <h2 className="text-3xl">Heading 2 (3xl)</h2>
            <h3 className="text-2xl">Heading 3 (2xl)</h3>
            <h4 className="text-xl">Heading 4 (xl)</h4>
            <h5 className="text-lg">Heading 5 (lg)</h5>
            <h6 className="text-base">Heading 6 (base)</h6>
            <p className="text-txt-secondary">This is a paragraph with secondary text color.</p>
          </div>
        </div>

        {/* Animation Tests */}
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Animations</h3>
          </div>
          <div className="card-body">
            <div className="flex items-center space-x-4">
              <div className="spinner"></div>
              <span>Loading spinner</span>
            </div>
          </div>
        </div>

        {/* Responsive Test */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold">Responsive Design</h3>
          </div>
          <div className="card-body">
            <div className="text-sm sm:text-base lg:text-lg xl:text-xl">
              This text changes size based on screen size
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-primary p-4 rounded-lg text-on-primary text-center">Mobile: 1 col</div>
              <div className="bg-secondary p-4 rounded-lg text-on-secondary text-center">Tablet: 2 cols</div>
              <div className="bg-surface p-4 rounded-lg text-on-surface text-center">Desktop: 3 cols</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 