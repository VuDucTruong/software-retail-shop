'use client'

import * as RadioGroup from '@radix-ui/react-radio-group'
import Image from 'next/image'
import clsx from 'clsx'
import {FC} from 'react'
import {BANK_CODES} from "@/lib/bankcodes";
import {useTranslations} from "next-intl";

type BankSelectorProps = {
  bankCodes: typeof BANK_CODES[number][]
  selected: string
  onChange: (bank: typeof BANK_CODES[number]) => void
}

const getBankLabel = (code: string, altMessage: string) =>
  code === '' ? altMessage : code

const getBankImage = (code: string) => {
  if (!code || code === '') return '/bank-icons/question.png'
  return `/bank-icons/${code}.svg` // e.g., /bank-icons/VIETCOMBANK.svg
}

export const BankSelector: FC<BankSelectorProps> = ({
                                                      bankCodes,
                                                      selected,
                                                      onChange,
                                                    }) => {
  const t = useTranslations();

  return (
    <RadioGroup.Root
      className="grid grid-cols-8 gap-4"
      value={selected}
      onValueChange={onChange}>

      {bankCodes.map((code) => (
        <RadioGroup.Item
          key={code}
          value={code}
          className={clsx(
            'flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition',
            selected === code
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-400'
          )}
        >
          <Image
            src={getBankImage(code)}
            alt={getBankLabel(code, t('decide_later'))}
            width={48}
            height={48}
            className="mb-2"
          />
          <span className="text-sm text-center">{getBankLabel(code, t('decide_later'))}</span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}
