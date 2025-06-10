import { useState, useEffect, useCallback } from "react";
import { SlideRenderer } from "./components/Slides/SlideRenderer";
import { Navigation } from "./components/Navigation/Navigation";

const API_BASE_URL = "http://localhost:3001/api";

function App() {
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/slides`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const sortedSlides = data.sort((a: any, b: any) => {
        const idA = parseInt(a.id.replace("slide-", ""), 10);
        const idB = parseInt(b.id.replace("slide-", ""), 10);
        return idA - idB;
      });

      setSlides(sortedSlides);
      setLoading(false);
    } catch (e: any) {
      console.log("Failed to fetch slides:", e);
    }
  };

  const updateSlideContent = useCallback(
    async (newContent: string) => {
      if (slides.length === 0 || !slides[index]) {
        return;
      }

      const slideIdToUpdate = slides[index].id;
      const currentSlideVersion = slides[index].content;

      if (newContent === currentSlideVersion) {
        console.log("Content unchanged");
        return;
      }

      const updatedSlidesLocal = [...slides];
      updatedSlidesLocal[index] = {
        ...updatedSlidesLocal[index],
        content: newContent,
      };
      setSlides(updatedSlidesLocal);

      try {
        const response = await fetch(
          `${API_BASE_URL}/slides/${slideIdToUpdate}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: newContent }),
          }
        );

        if (!response.ok) {
          setSlides(slides);
          throw new Error(
            `Failed to save slide to backend: ${
              response.statusText || "Unknown error"
            }`
          );
        }
      } catch (e: any) {
        console.log("error: ", e);
        setSlides(slides);
      }
    },
    [slides, index]
  );

  return (
    <div className="max-w-3xl mx-auto p-8">
      {!loading ? (
        <div>
          <SlideRenderer
            content={slides[index].content}
            onChange={updateSlideContent}
          />
          <Navigation
            current={index}
            total={slides.length}
            onPrev={() => setIndex(index - 1)}
            onNext={() => setIndex(index + 1)}
          />
        </div>
      ) : (
        <div>
          <h1>Data Loading...</h1>
        </div>
      )}
    </div>
  );
}

export default App;
