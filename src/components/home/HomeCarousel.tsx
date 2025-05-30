"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const banners = [
  "/banner/banner-1.png",
  "/banner/banner-2.png",
  "/banner/banner-3.png",
  "/banner/banner-4.png",
  "/banner/banner-5.png",
  "/banner/banner-6.png",
]


export function HomeCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length );
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center gap-2">
          <Carousel
          opts={{
            slidesToScroll: 2, // Scrolls 2 items at a time
            loop: true, // Enables looping
          }}
            setApi={setApi}
            plugins={[plugin.current]}
            className="w-full group"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {banners.map((banner, index) => (
                <CarouselItem key={index} className="md:basis-1/2">
                  <div className="p-1">
                    <Card className="p-0">
                      <CardContent className="h-60 w-full relative">
                        <Image
                          src={banner}
                          alt="Banner"
                          sizes="100%"
                          fill
                          className="rounded-md"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className=" invisible group-hover:visible" />
            <CarouselNext className=" invisible group-hover:visible" />
          </Carousel>
          <div className="flex gap-1">
            {Array.from({ length: count }).map((_, index) => (
              <div
                key={index}
                className={`h-1 w-8 rounded-md  ${
                  current === index + 1 ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
