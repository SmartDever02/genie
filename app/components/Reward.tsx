'use client'
import React from 'react'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'

const Reward = ({ miners }: { miners: number[] }) => {
    const { data, error, isLoading } = useSWR('/api/getRewards', fetcher, {
        revalidateOnFocus: false,
        refreshInterval: 200000
    })
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading data</div>
    if (data) {
        const sortedData = data?.sort((a: any, b: any) => b.incentive - a.incentive)
        const addedGrade = sortedData.map((item: any, index: number) => ({
            ...item,
            grade: index + 1,
        }))
        const filteredData = addedGrade.filter((item: any) =>
            miners?.includes(item.uid)
        );
        const Result = filteredData.map((item: any) => ({
            Grade: item.grade,
            UID: item.uid,
            Stake: item.stake,
            Incentive: item.incentive,
            Performance: item.minerPerformance,
            daily: item.taoPerDay,
            Score: item.score,
        }));
        const total_stake = filteredData.reduce((acc: number, item: any) => acc + item.stake, 0);
        const total_daily = filteredData.reduce((acc: number, item: any) => acc + item.taoPerDay, 0);
        if (window) {
            (window as any).total_daily = total_daily;
            (window as any).my_top_miner_performance = filteredData[0].minerPerformance;
            (window as any).my_top_miner_uid = filteredData[0].uid;
            (window as any).my_top_miner_grade = filteredData[0].grade;

            let grade = 0, performance = 0;
            for (let i = 0; i < filteredData.length; i++) {
                grade += filteredData[i].grade;
                performance += filteredData[i].minerPerformance;
            }

            (window as any).my_avg_performance = performance / filteredData.length;
            (window as any).my_avg_performance_grade = grade / filteredData.length;
        }

        return (
            <div className='w-full p-10 border border-white rounded-2xl border-collapse'>
                <div className='flex flex-col gap-5'>
                    <div className='text-2xl font-bold text-center'>Rewards</div>
                    <table>
                        <thead>
                            <tr className='border border-white'>
                                <th className='py-2'>UID</th>
                                <th className='py-2'>Grade</th>
                                {/* <th className='py-2'>Stake</th> */}
                                {/* <th className='py-2'>Incentive</th> */}
                                {/* <th className='py-2'>Performance</th> */}
                                <th className='py-2'>Daily</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Result.map((item: any) => (
                                    <tr key={item.UID} className='border border-white'>
                                        <td className='text-center transition-all duration-300 cursor-pointer'>{item.UID}</td>
                                        <td className='text-center'>{item.Grade}</td>
                                        {/* <td className='text-center'>{Number(item.Stake).toFixed(3)}</td> */}
                                        {/* <td className='text-center'>{Number(item.Incentive).toFixed(8)}</td> */}
                                        {/* <td className='text-center'>{Number(item.Performance).toFixed(2)}</td> */}
                                        <td className='text-center'>{Number(item.daily).toFixed(3)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className='flex flex-col gap-2 mt-4 justify-center items-center'>
                        <span>Total Daily: {total_daily}</span>
                        <span>Total Stake: {total_stake}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default Reward