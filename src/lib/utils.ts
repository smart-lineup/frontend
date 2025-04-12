import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 조건부 클래스 이름을 결합하는 유틸리티 함수
 * Tailwind CSS 클래스를 효율적으로 병합합니다.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
