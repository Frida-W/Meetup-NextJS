import { useEffect, useState } from "react";
import styles from "./index.module.scss"

interface IProps {
  time: number;
  onEnd: Function;
}
const CountDown = (props: IProps) => {
  const { time, onEnd } = props;
  const [count, setCount] = useState(time || 60);

  useEffect(() => {
    let timer: any = null;
    if (count > 0) {
        timer = setTimeout(() => {
            setCount(count - 1);
        }, 1000);
    } else {
        onEnd && onEnd();
        clearTimeout(timer);
    }
    return () => {
        clearTimeout(timer);
    };
});

useEffect(() => {
    setCount(count);
}, [time]);

return <div className={styles.countDown}>{count}</div>;
};

//   useEffect(() => {
//     const id = setInterval(() => {
//       setCount((count) => {
//         if (count === 0) {
//           clearInterval(id);
//           onEnd && onEnd();
//           return count;
//         }
//          return count - 1;
//       });
//     }, 1000);
//     return () => {
//       clearInterval(id);
//     }
//   }, [time, onEnd]);
//   return <div className={styles.countDown}>{count}</div>;
// };

export default CountDown;
