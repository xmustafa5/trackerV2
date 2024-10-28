import { useState, useEffect } from 'react';
import './tooltip.css'; // Include your custom CSS styles

function Tooltip() {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-tooltip-id]');
      if (target) {
        const tooltipId = target.getAttribute('data-tooltip-id');
        const content = target.getAttribute('data-tooltip-content');
        
        if (tooltipId && content) {
          setTooltipContent(content);
          setPosition({
            top: e.pageY + 10, // Offset from the mouse position
            left: e.pageX + 10,
          });
          setTooltipVisible(true);
        }
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('[data-tooltip-id]');
      if (target) {
        setTooltipVisible(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousemove', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousemove', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    tooltipVisible && (
      <div
        className="tooltip-box"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        {tooltipContent}
      </div>
    )
  );
}

export default Tooltip;
