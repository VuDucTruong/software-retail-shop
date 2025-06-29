import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"


type Props = {
    children: React.ReactNode
    className?: string
    content: string
}


export default function CommonToolTip(props: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          {props.children}
        </div>
      </TooltipTrigger>
      <TooltipContent className={props.className}>
        {props.content}
      </TooltipContent>
    </Tooltip>
  )
}
