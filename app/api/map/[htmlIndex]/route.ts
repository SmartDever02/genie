import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const Schema = z.object({
  type: z.enum(['ACCURACY', 'LIGHTHOUSE', 'BALANCED']),
})

export async function POST(
  request: Request,
  { params }: { params: { htmlIndex: string } }
) {
  // Function to calculate the average of an array
  function calculateAverage(arr: number[]): number {
    if (arr.length === 0) return 0
    const sum = arr.reduce((total, current) => total + current, 0)
    return sum / arr.length
  }

  try {
    const jsonData = await request.json()
    const parsedData = Schema.safeParse(jsonData)

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.format() },
        { status: 400 }
      )
    }

    const apiKey = request.headers.get('api-key')
    const SECRET_KEY = process.env.API_TOKEN

    // Validate API key
    if (!apiKey || apiKey !== SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type } = parsedData.data

    const scores = await prisma.scores.findMany({
      where: {
        htmlIndex: Number(params.htmlIndex),
      },
    })

    const visualScores = scores.map((item) => item.visualScores)
    // Get the length of inner arrays (assuming all have the same length)
    const innerLength = visualScores[0].length

    // Initialize arrays to hold values at each position
    const positionArrays: number[][] = Array(innerLength)
      .fill(null)
      .map(() => [])

    // Group values by their position in each sub-array
    visualScores.forEach((subArray) => {
      subArray.forEach((value, index) => {
        if (index < innerLength) {
          positionArrays[index].push(value)
        }
      })
    })

    // Calculate average for each position
    const positionAverages = positionArrays.map(calculateAverage)

    console.log('positionAverages', positionAverages)

    // Find the position with the highest average
    let maxAvg = Number.NEGATIVE_INFINITY
    let maxIdx = -1

    positionAverages.forEach((avg, idx) => {
      if (avg > maxAvg) {
        maxAvg = avg
        maxIdx = idx
      }
    })

    // Group values by their position in each sub-array
    visualScores.forEach((subArray) => {
      subArray.forEach((value, index) => {
        if (index < innerLength) {
          positionArrays[index].push(value)
        }
      })
    })

    // Get indexes and averages sorted by ranking (highest to lowest)
    const sortedData = positionAverages
      .map((avg, idx) => ({ index: idx, avg })) // Pair index with its average
      .sort((a, b) => b.avg - a.avg) // Sort by average in descending order

    console.log(`The position with the highest average is: ${maxIdx}`)
    console.log(`The highest average is: ${maxAvg}`)
    console.log(`Indexes by ranking is: ${sortedData.map((item) => item.index)}`)

    await prisma.maps.upsert({
      where: {
        htmlIndex_challangeType: {
          challangeType: type,
          htmlIndex: Number(params.htmlIndex),
        },
      },
      create: {
        challangeType: type,
        htmlIndex: Number(params.htmlIndex),
        indexes: sortedData.map((item) => item.index),
        avgScores: sortedData.map((item) => item.avg)
      },
      update: {
        challangeType: type,
        htmlIndex: Number(params.htmlIndex),
        indexes: sortedData.map((item) => item.index),
        avgScores: sortedData.map((item) => item.avg)
      },
    })

    return NextResponse.json({
      success: true,
      position: maxIdx,
      topAverage: maxAvg,
      scores: visualScores.map((subArray) => subArray[maxIdx]),
    })
  } catch (error) {
    console.error('Error getting html payloads for htmlIndex:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
