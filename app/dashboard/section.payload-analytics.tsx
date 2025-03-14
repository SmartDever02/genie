import PayloadTodo from '@/components/payload.todo'
import { Prisma } from '@prisma/client'

export default async function PayloadAnalytics({
  payloads,
}: {
  payloads: (Prisma.PickEnumerable<
    Prisma.PayloadsGroupByOutputType,
    'htmlIndex'[]
  > & {
    _count: {
      variantIndex: number
    }
  })[]
}) {
  const total = payloads
    .map((item) => item._count.variantIndex)
    .reduce((total, item) => total + item)

  return (
    <section className="w-fit border border-gray-300 p-5 rounded-md">
      <p className="pb-1">
        <b className="font-semibold">
          {payloads.length} HTML Payloads ({total})
        </b>
        <br />
        <span className="text-sm leading-4">HTML payloads generated</span>
      </p>
      <hr className="my-3 border-dashed border-gray-400" />
      <ul className="max-h-[600px] overflow-y-auto mb-5">
        {payloads.map((item) => (
          <li
            key={item.htmlIndex}
            className={`hover:bg-white/10 transition-all duration-150 rounded-sm flex items-center text-base py-1 px-2`}
          >
            <span
              className={`block mr-1 rounded-full size-5 ${
                item._count.variantIndex >= 50
                  ? 'bg-green-500'
                  : item._count.variantIndex >= 15
                  ? 'bg-blue-300'
                  : 'bg-slate-400'
              }`}
            />
            html_index_{item.htmlIndex}:{' '}
            <b className="font-semibold pl-2">{item._count.variantIndex}</b>
          </li>
        ))}
      </ul>

      <PayloadTodo />
    </section>
  )
}
