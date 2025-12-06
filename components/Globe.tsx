
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { RadioStation } from '../types';

interface GlobeProps {
  stations: RadioStation[];
  onStationSelect: (station: RadioStation) => void;
  currentStation: RadioStation | null;
}

const Globe: React.FC<GlobeProps> = ({ stations, onStationSelect, currentStation }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mutable state for D3 animation
  const rotationRef = useRef<[number, number, number]>([0, -20, 0]);
  const isDraggingRef = useRef(false);
  const baseScaleRef = useRef<number>(250); // Default, updated by resize
  
  // D3 selections & objects refs to share between effects
  const projectionRef = useRef<d3.GeoProjection | null>(null);
  const pathRef = useRef<d3.GeoPath<any, d3.GeoPermissibleObjects> | null>(null);
  const mapGroupRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const dotsGroupRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const oceanRef = useRef<d3.Selection<SVGPathElement, unknown, null, undefined> | null>(null);

  // Control Refs
  const resetViewRef = useRef<() => void>(() => {});
  const zoomInRef = useRef<() => void>(() => {});
  const zoomOutRef = useRef<() => void>(() => {});

  // Initialization Effect (Run Once)
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Initial setup
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous

    // Setup Projection placeholder (will be sized by resize observer)
    const projection = d3.geoOrthographic()
      .center([0, 0])
      .rotate(rotationRef.current);
    projectionRef.current = projection;

    const path = d3.geoPath().projection(projection);
    pathRef.current = path;

    // --- DEFS (Filters/Gradients) ---
    const defs = svg.append("defs");
    
    // Glow Filter
    const filter = defs.append("filter").attr("id", "glow");
    filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Ocean Gradient
    const oceanGradient = defs.append("radialGradient")
      .attr("id", "oceanGradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
    oceanGradient.append("stop").attr("offset", "0%").attr("stop-color", "#0A1A10");
    oceanGradient.append("stop").attr("offset", "100%").attr("stop-color", "#000000");

    // --- LAYERS ---
    const ocean = svg.append("path")
      .datum({ type: "Sphere" })
      .attr("class", "sphere")
      .attr("fill", "url(#oceanGradient)")
      .attr("stroke", "#00FF9D")
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.3);
    oceanRef.current = ocean;

    const mapGroup = svg.append("g");
    mapGroupRef.current = mapGroup;
    
    const dotsGroup = svg.append("g");
    dotsGroupRef.current = dotsGroup;

    // Load Data
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((data: any) => {
        if (!mapGroupRef.current) return;
        const countries = feature(data, data.objects.countries);

        // Draw Countries
        mapGroupRef.current.selectAll("path")
          .data((countries as any).features)
          .enter().append("path")
          .attr("fill", "#0a2a1a")
          .attr("stroke", "#00FF9D")
          .attr("stroke-width", 0.5)
          .attr("stroke-opacity", 0.3)
          .style("opacity", 0.8)
          .style("pointer-events", "none"); // Let clicks pass to ocean for dragging
          
        // Initial render after data load
        updatePaths();
      });

    // --- UPDATE FUNCTION ---
    const updatePaths = () => {
        if (!pathRef.current || !projectionRef.current) return;
        
        // Update Ocean
        if (oceanRef.current) {
            oceanRef.current.attr("d", pathRef.current);
        }

        // Update Countries
        if (mapGroupRef.current) {
            mapGroupRef.current.selectAll("path").attr("d", pathRef.current as any);
        }

        // Update Dots (manual projection for performance)
        if (dotsGroupRef.current) {
             const center = projectionRef.current.invert!([
                 projectionRef.current.translate()[0], 
                 projectionRef.current.translate()[1]
             ]);

             dotsGroupRef.current.selectAll("circle")
                .attr("cx", (d: any) => {
                    const coords = projectionRef.current!(d.coordinates);
                    return coords ? coords[0] : 0;
                })
                .attr("cy", (d: any) => {
                    const coords = projectionRef.current!(d.coordinates);
                    return coords ? coords[1] : 0;
                })
                .style("opacity", (d: any) => {
                    const distance = d3.geoDistance(d.coordinates, center!);
                    return distance > 1.57 ? 0 : 1;
                });
        }
    };

    // --- ZOOM BEHAVIOR ---
    const zoom = d3.zoom()
        .scaleExtent([0.5, 4])
        // Disable user interactions (wheel, dblclick) so wheel scrolls the page
        // and zoom is only controlled via buttons.
        .filter(() => false)
        .on("zoom", (event) => {
            const k = event.transform.k;
            if (projectionRef.current) {
                // Apply zoom factor to the base responsive scale
                projectionRef.current.scale(baseScaleRef.current * k);
                updatePaths();
            }
        });

    svg.call(zoom as any);

    // --- RESIZE OBSERVER ---
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === containerRef.current && projectionRef.current) {
           const width = entry.contentRect.width;
           const height = entry.contentRect.height;
           
           // Responsive Divisor Logic
           // Mobile (< 768px): Use a smaller divisor (2.1) to make the globe appear larger relative to the container.
           // Desktop: Use larger divisor (2.5) for comfortable padding.
           const isMobile = width < 768;
           const divisor = isMobile ? 2.1 : 2.5;

           // Calculate base scale to fit perfectly based on smallest dimension
           const newBaseScale = Math.min(width, height) / divisor; 
           baseScaleRef.current = newBaseScale;
           
           // Get current zoom level (k) to maintain zoom during resize
           const currentTransform = d3.zoomTransform(svg.node() as Element);
           
           projectionRef.current
             .scale(newBaseScale * currentTransform.k)
             .translate([width / 2, height / 2]);
             
           updatePaths();
        }
      }
    });
    
    resizeObserver.observe(containerRef.current);

    // --- DRAG BEHAVIOR ---
    const drag = d3.drag()
        .subject(() => ({ x: rotationRef.current[0], y: rotationRef.current[1] }))
        .on("start", () => {
            isDraggingRef.current = true;
            svg.style("cursor", "grabbing");
        })
        .on("drag", (event) => {
            const rotate = projection.rotate();
            // Sensitivity adjustment based on scale (zoom level)
            // As we zoom in, rotation should be slower
            const currentScale = projection.scale();
            const k = 75 / currentScale; 
            
            rotationRef.current = [
                rotate[0] + event.dx * k * (currentScale / baseScaleRef.current), // normalize sensitivity
                rotate[1] - event.dy * k * (currentScale / baseScaleRef.current),
                rotate[2]
            ];
            projection.rotate(rotationRef.current);
            updatePaths();
        })
        .on("end", () => {
            isDraggingRef.current = false;
            svg.style("cursor", "grab");
        });

    svg.call(drag as any);

    // --- ANIMATION LOOP ---
    const timer = d3.timer(() => {
        if (!isDraggingRef.current) {
            const rotate = projection.rotate();
            // Slow smooth rotation
            rotationRef.current = [rotate[0] + 0.015, rotate[1], rotate[2]];
            projection.rotate(rotationRef.current);
            updatePaths();
        }
    });

    // --- CONTROLS IMPLEMENTATION ---
    resetViewRef.current = () => {
        const startRotate = projection.rotate();
        const endRotate: [number, number, number] = [0, -20, 0];
        const r = d3.interpolate(startRotate, endRotate);

        svg.transition()
           .duration(1000)
           .ease(d3.easeCubicOut)
           .call(zoom.transform, d3.zoomIdentity) // Reset Zoom K to 1
           .tween("rotate", () => {
               return (t) => {
                   rotationRef.current = r(t);
                   projection.rotate(rotationRef.current);
                   updatePaths();
               };
           });
    };

    zoomInRef.current = () => {
        svg.transition().duration(500).call(zoom.scaleBy, 1.5);
    };

    zoomOutRef.current = () => {
        svg.transition().duration(500).call(zoom.scaleBy, 0.66);
    };

    // Cleanup
    return () => {
        timer.stop();
        resizeObserver.disconnect();
        svg.selectAll('*').remove();
    };
  }, []); // Run only once on mount

  // --- DOTS UPDATE EFFECT ---
  // This effect runs whenever stations or selection changes to update just the dots
  useEffect(() => {
     if (!dotsGroupRef.current) return;

     const dots = dotsGroupRef.current.selectAll("circle").data(stations, (d: any) => d.id);

     const enter = dots.enter().append("circle")
        .attr("r", 0) // animate in
        .attr("fill", "#00FF9D")
        .attr("stroke", "#00FF9D")
        .attr("stroke-width", 2)
        .style("filter", "url(#glow)")
        .style("cursor", "pointer")
        .on("click", (event, d) => {
            event.stopPropagation();
            onStationSelect(d);
        });

     enter.append("title").text(d => `${d.name} - ${d.location}`);

     enter.merge(dots as any)
        .transition().duration(500)
        .attr("r", (d) => currentStation?.id === d.id ? 8 : 4)
        .attr("fill", (d) => currentStation?.id === d.id ? "#FFFFFF" : "#00FF9D");

     dots.exit().transition().duration(500).attr("r", 0).remove();
     
     // Force an initial position update 
     if (projectionRef.current && containerRef.current) {
         const center = projectionRef.current.invert!([
             projectionRef.current.translate()[0], 
             projectionRef.current.translate()[1]
         ]);

         enter.merge(dots as any)
            .attr("cx", (d: any) => {
                const coords = projectionRef.current!(d.coordinates);
                return coords ? coords[0] : 0;
            })
            .attr("cy", (d: any) => {
                const coords = projectionRef.current!(d.coordinates);
                return coords ? coords[1] : 0;
            })
            .style("opacity", (d: any) => {
                const distance = d3.geoDistance(d.coordinates, center!);
                return distance > 1.57 ? 0 : 1;
            });
     }

  }, [stations, currentStation, onStationSelect]);

  return (
    <div ref={containerRef} className="w-full h-full relative flex justify-center items-center overflow-hidden">
      {/* touchAction: 'none' is critical for mobile drag interactions to prevent scroll */}
      <svg ref={svgRef} className="w-full h-full block" style={{ cursor: 'grab', touchAction: 'none' }} />
      
      {/* Decorative Orbits - Adjusted sizes to be relative to container */}
      <div className="absolute inset-0 pointer-events-none border rounded-full border-neon-dim/20 w-[80%] h-[80%] top-[10%] left-[10%] animate-[spin_60s_linear_infinite]" />
      <div className="absolute inset-0 pointer-events-none border border-dashed rounded-full border-neon-dim/30 w-[90%] h-[90%] top-[5%] left-[5%] animate-[spin_80s_linear_infinite_reverse]" />

      {/* View Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
         <button 
             onClick={() => zoomInRef.current()}
             className="w-10 h-10 bg-black/50 backdrop-blur border border-neon/30 text-neon hover:bg-neon hover:text-black rounded-lg flex items-center justify-center transition-all shadow-[0_0_10px_rgba(0,255,157,0.1)]"
             title="Zoom In"
         >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
         </button>
         <button 
             onClick={() => zoomOutRef.current()}
             className="w-10 h-10 bg-black/50 backdrop-blur border border-neon/30 text-neon hover:bg-neon hover:text-black rounded-lg flex items-center justify-center transition-all shadow-[0_0_10px_rgba(0,255,157,0.1)]"
             title="Zoom Out"
         >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
         </button>
         <button 
             onClick={() => resetViewRef.current()}
             className="w-10 h-10 bg-black/50 backdrop-blur border border-neon/30 text-neon hover:bg-neon hover:text-black rounded-lg flex items-center justify-center transition-all shadow-[0_0_10px_rgba(0,255,157,0.1)] mt-2"
             title="Reset View"
         >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
         </button>
      </div>
    </div>
  );
};

export default Globe;
