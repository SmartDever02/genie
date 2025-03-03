'use client'
import React from 'react'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'
type Props = {
    miner: string
}

const ValidateItem = ({ miner }: Props) => {
    const { data, error, isLoading } = useSWR(`https://synth.mode.network/validation/miner?uid=${miner}`, fetcher, {
        revalidateOnFocus: false,
        refreshInterval: 200000
    })

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading data</div>
    if (data) {
        if (!data.validated) {
            if (window) {
                const arr = Array.isArray((window as any).bad_miners) ? (window as any).bad_miners : [];
                arr.push(miner);
                // @ts-ignore filter method is battle tested
                const uniqueArray = arr.filter((value, index, self) => self.indexOf(value) === index);
                (window as any).bad_miners = [...uniqueArray]
            }
        }

        return <div className='flex flex-row gap-2 items-center text-sm'>
            <div className='rounded-full w-14 h-8 flex items-center justify-center transition-all duration-300 bg-indigo-500 cursor-pointer'>{miner}</div>
            <div>{data.validated}</div>
            <div className='text-2xl' title={data.validated ? undefined : data.reason}>{data.validated ? '✅' : '❌'}</div>
        </div>
    }
}

export default ValidateItem