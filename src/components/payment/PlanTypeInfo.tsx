import { useEffect, useState } from "react"
import axios from "axios"
import config from "../../config"

export interface PlanInfo {
    korean: string
    month: number
    price: number
}

export interface PlanTypeInfo {
    monthly: PlanInfo
    annual: PlanInfo
}

interface PlanTypeResult {
    data?: PlanTypeInfo
    isLoading: boolean
    premiumPrice: number
    annualSaving: number
}

export function usePlanTypeInfo(isAnnual: boolean): PlanTypeResult {
    const [data, setData] = useState<PlanTypeInfo>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchPlanType() {
            try {
                const response = await axios.get<PlanTypeInfo>(config.backend + "/payment/plan-type", {
                    withCredentials: true,
                })
                setData(response.data)
            } catch (e) {
                console.error("Failed to load plan type info", e)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPlanType()
    }, [])

    let premiumPrice = 0
    let annualSaving = 0

    if (!isLoading && data) {
        premiumPrice = isAnnual ? data.annual.price : data.monthly.price
        annualSaving =
            ((data.monthly.price * 12 - data.annual.price) / (data.monthly.price * 12)) * 100
    }

    return {
        data,
        isLoading,
        premiumPrice,
        annualSaving,
    }
}