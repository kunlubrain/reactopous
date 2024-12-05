import React, { useMemo, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

const SatelliteMap = ({ data, config }) => {
    const svgRef = useRef(null);
    const defaultSize = 50;
    const defaultDistance = 200;

    // Extracting the distance data
    const distances = data.map(d => d[config.distanceBy] || defaultDistance);
    const avgDistance = distances.reduce((acc, val) => acc + val, 0) / distances.length;
    const normalizedDistances = distances.map(d => (d / avgDistance) * defaultDistance);

    // Dynamic color mapping for the colorBy column
    const colorMap = useMemo(() => {
        const uniqueCategories = [...new Set(data.map(d => d[config.colorBy]))];
        const colors = [
            "#90caf9", "#a5d6a7", "#ffcc80", "#f48fb1", "#ce93d8", "#b39ddb", "#ffab91"
        ];
        return uniqueCategories.reduce((acc, category, i) => {
            acc[category] = colors[i % colors.length];
            return acc;
        }, {});
    }, [data, config.colorBy]);

    // Process data with memoized logic
    const processedData = useMemo(() => data.map((d, i) => ({
        text: d[config.satellite],
        size: d[config.sizeBy] || defaultSize,
        distance: config.distanceBy ? normalizedDistances[i] : defaultDistance,
        icon: d[config.icon] || null,
        color: config.colorBy ? colorMap[d[config.colorBy]] : colorMap[i % colorMap.length],
        description: d.description
    })), [data, config, normalizedDistances, colorMap]);

    const angleStep = (2 * Math.PI) / processedData.length;

    useEffect(() => {
        if (svgRef.current) {
            const svg = svgRef.current;

            // Create gradient definition
            const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
            gradient.setAttribute("id", "iconGradient");
            gradient.innerHTML = `
                <stop offset="0%" stop-color="white" />
                <stop offset="100%" stop-color="#4682B4" />
            `;
            svg.querySelector('defs').appendChild(gradient);
        }
    }, []);

    return (
        <svg ref={svgRef} width="800" height="800" style={{ backgroundColor: '#f5f5f5' }}>
            {/* Lines from central circle to each satellite */}
            {processedData.map((item, index) => {
                const angle = index * angleStep;
                const x = 400 + item.distance * Math.cos(angle);
                const y = 400 + item.distance * Math.sin(angle);

                return (
                    <line
                        key={`line-${index}`}
                        x1="400"
                        y1="400"
                        x2={x}
                        y2={y}
                        stroke="#b0bec5"
                        strokeWidth="2"
                    />
                );
            })}

            {/* Central Circle */}
            <g filter="url(#shadow)">
                <circle cx="400" cy="400" r="100" fill="#64b5f6" />
                <text
                    x="400"
                    y="400"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="18"
                    fill="#ffffff"
                >
                    {data[0][config.center]}
                </text>
            </g>

            {/* Satellite Circles */}
            {processedData.map((item, index) => {
                const angle = index * angleStep;
                const x = 400 + item.distance * Math.cos(angle);
                const y = 400 + item.distance * Math.sin(angle);

                return (
                    <g key={index} transform={`translate(${x},${y})`} filter="url(#shadow)">
                        {/* Satellite Circle */}
                        <circle r={item.size} fill={item.color} />

                        {/* Icon */}
                        {item.icon && (
                            <foreignObject
                                width={item.size}
                                height={item.size}
                                x={-item.size / 2}
                                y={-item.size / 2 - 20}
                            >
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Icon
                                        icon={item.icon}
                                        style={{
                                            fontSize: item.size / 2,
                                            fill: 'url(#iconGradient)',
                                            filter: 'url(#iconGradient)',
                                        }}
                                    />
                                </div>
                            </foreignObject>
                        )}

                        {/* Text */}
                        <text
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fontSize={item.size / 5}
                            dy={item.icon ? `${item.size / 6}px` : "0"}
                        >
                            {item.text}
                        </text>
                    </g>
                );
            })}

            {/* SVG filter for subtle shadow */}
            <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
                </filter>
            </defs>
        </svg>
    );
};

export default SatelliteMap;