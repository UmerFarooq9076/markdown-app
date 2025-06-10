import { useState } from 'react';
import { slides as initialSlides } from './data/slides';
import { SlideRenderer } from './components/Slides/SlideRenderer';
import { Navigation } from './components/Navigation/Navigation';

function App() {
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState<any>(initialSlides);

  const updateSlideContent = (newContent: string) => {
  const updatedSlides = [...slides];
  updatedSlides[index] = {
    ...updatedSlides[index],
    content: newContent
  };

  setSlides(updatedSlides);
};


  return (
    <div className="max-w-3xl mx-auto p-8">
      <SlideRenderer content={slides[index].content} onChange={updateSlideContent} />
      <Navigation
        current={index}
        total={slides.length}
        onPrev={() => setIndex(index - 1)}
        onNext={() => setIndex(index + 1)}
      />
    </div>
  );
}

export default App;
