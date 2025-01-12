document.addEventListener("DOMContentLoaded", function () {
    const elements: NodeListOf<HTMLElement> = document.querySelectorAll("[data-include]");
    const totalPartials: number = elements.length;
    let processedPartials: number = 0;
  
    const scrollToElementId = (id: string): void => {
      const element: HTMLElement | null = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        console.error(`Element with id '${id}' not found.`);
      }
    };
  
    const checkAllProcessed = (): void => {
      if (processedPartials === totalPartials) {
        const event = new CustomEvent("partialsLoaded");
        document.dispatchEvent(event);
  
        const url: URL = new URL(window.location.href);
        const id: string = url.hash.slice(1);
        if (id) {
          scrollToElementId(id);
        }
      }
    };
  
    checkAllProcessed();
  
    elements.forEach((element: HTMLElement) => {
      const src: string | null = element.getAttribute("data-include");
  
      if (src) {
        fetch(src)
          .then(response => {
            if (response.status === 200) {
              return response.text();
            } else {
              return Promise.reject(
                new Error(`Failed to load ${src} with status ${response.status}`)
              );
            }
          })
          .then(html => {
            element.outerHTML = html;
            processedPartials++;
            checkAllProcessed();
          })
          .catch(error => {
            console.error("Error including file:", error);
            processedPartials++;
            checkAllProcessed();
          });
      }
    });
  });
  