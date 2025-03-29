import clsx from "clsx";
import { THEME, useTheme } from "./context/ThemeProvider";

export default function ThemeContent() {
    const { theme } = useTheme();

    const isLightMode = theme === THEME.LIGHT;
    

    return (
        <div className={clsx(
            'px-4 h-dvh w-full', isLightMode ? 'bg-white' : 'bg-gray-800'
        )}>
            <h1 className={clsx(
                'text-wxl font-bold',
                isLightMode ? 'text-black' : 'text-white'
            )}>
                Theme Content
            </h1>
            <p className={clsx('mt-2', isLightMode ? 'text-black' : 'text-white')}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo iusto assumenda quibusdam saepe eos provident eaque deserunt ad excepturi asperiores, labore rem ipsam, ullam, vel facilis placeat! Nesciunt, recusandae quam!
            </p>
        </div>
    )
}