"use client"
import React from 'react'
import ValidateItem from './ValidateItem'

const Validate = (props: { miners: number[] }) => {
    return (
        <div className='flex flex-col gap-5 p-5 border border-white rounded-2xl justify-center items-center'>
            <div className='text-2xl font-bold text-center'>Validate</div>
            <div className='flex flex-col gap-1'>
                {
                    props?.miners?.map((miner, index) => <ValidateItem key={index} miner={miner.toString()} />)
                }
            </div>
        </div>
    )
}

export default Validate