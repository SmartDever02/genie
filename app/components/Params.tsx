'use client'

import { useState } from "react";
import NewParamRow from "./Param.New.Row";
import ParamRow, { Row } from "./Param.Row";

interface Props {
  data: Row[]
}

export default function Params(props: Props) {
  const [gapSort, setGapSort] = useState<'asc' | 'desc'>('asc');

  return <table className="border border-white border-collapse mb-4">
    <thead>
      <tr className="border border-white">
        <th>No</th>
        <th>UID</th>
        <th>Owner</th>
        <th>index</th>
        <th>dir</th>
        <th className="cursor-pointer flex justify-center items-center gap-x-1" onClick={() => setGapSort(gapSort === 'asc' ? 'desc' : 'asc')}>gap <span className={gapSort === 'asc' ? "" : "rotate-180"}>⬆️</span></th>
        <th>Updated at</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {props?.data?.sort((a, b) => gapSort === 'asc' ? b.gap - a.gap : a.gap - b.gap)?.map((item, index) => (
        <ParamRow {...item} key={item.uid} noIndex={index + 1} />
      ))}
      <NewParamRow />
    </tbody>
  </table>
}