import "/styles/fonts.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ModalContext } from "@/contexts/ModalContext";
import { Hydrate } from "react-query/hydration";
import packageJson from "../package.json";

const insert2body = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  div.style.display = "none";
  document.querySelector("body")?.prepend(div);
};

(async () => {
  if (typeof window !== "undefined" && "caches" in window) {
    const spriteLink = "/sprite.svg";
    const newCacheName = `${packageJson.name}@${packageJson.version}`;
    const newCache = await caches.open(newCacheName);
    const options = {
      method: "GET",
      headers: new Headers({
        "Content-Type": "image/svg+xml",
      }),
    };
    let response = await newCache.match(spriteLink);
    let html;

    if (!response) {
      const cacheNames: string[] = await caches.keys();
      cacheNames.forEach((item) => {
        if (item?.indexOf(packageJson.name) !== -1 && item !== newCacheName) {
          caches.delete(item);
        }
      });

      const req = new Request(spriteLink, options);
      await newCache.add(req);
      response = await newCache.match(spriteLink);
      html = await response?.text();
      insert2body(html || "");
      return;
    }

    html = await response.text();
    insert2body(html);
  }
})();

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [modalValue, setModalValue] = useState({ filterModal: false });

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ModalContext.Provider value={[modalValue, setModalValue]}>
          <Component {...pageProps} />
        </ModalContext.Provider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
