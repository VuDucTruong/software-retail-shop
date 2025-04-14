
import {
  MDXEditor,
  headingsPlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  BlockTypeSelect,
  Separator,
  MDXEditorMethods,
  linkDialogPlugin,
  tablePlugin,
  StrikeThroughSupSubToggles,
  InsertTable,
  InsertThematicBreak,
} from "@mdxeditor/editor"
import "@mdxeditor/editor/style.css"
import "@/styles/mdx_editor.css"
import React from "react"

type Props = {
    markdown: string
    onChange: (markdown: string) => void
}

export const MdxEditorInput = (props: Props) => {
    const { markdown, onChange } = props
  return (
    <div className="border rounded-md overflow-hidden shadow-sm bg-white">
      <MDXEditor
        markdown={markdown}
        onChange={onChange}
        className="prose prose-sm max-w-none prose-a:text-blue-600 prose-p:m-0"
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <ListsToggle />
                <CreateLink />
                <InsertThematicBreak />
                <Separator />
                <StrikeThroughSupSubToggles />
                <Separator />
                <InsertTable />
              </>
            ),
          }),
          markdownShortcutPlugin(),
          headingsPlugin(),
          listsPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          linkPlugin(),
          thematicBreakPlugin(),
          tablePlugin(),
        ]}
      />
    </div>
  )
}
