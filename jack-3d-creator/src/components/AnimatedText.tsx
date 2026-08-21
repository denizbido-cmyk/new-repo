import { Fragment, useRef } from 'react';
import type { CSSProperties } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

interface CharProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function Char({ char, progress, range }: CharProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="invisible">{char}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {char}
      </motion.span>
    </span>
  );
}

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(' ');
  const totalChars = text.replace(/ /g, '').length;
  let charIndex = 0;

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, wordIndex) => {
        const rendered = (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.split('').map((char, charIdx) => {
              const i = charIndex;
              charIndex += 1;
              const start = i / totalChars;
              const end = (i + 1) / totalChars;
              return (
                <Char key={charIdx} char={char} progress={scrollYProgress} range={[start, end]} />
              );
            })}
          </span>
        );
        return (
          <Fragment key={`w-${wordIndex}`}>
            {rendered}
            {wordIndex < words.length - 1 ? ' ' : ''}
          </Fragment>
        );
      })}
    </p>
  );
}
