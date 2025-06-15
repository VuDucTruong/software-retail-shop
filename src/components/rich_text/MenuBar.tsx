import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link,
  List,
  ListOrdered,
  Strikethrough,
  Table,
  Underline,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { Toggle } from "../ui/toggle";
  
  export default function MenuBar({ editor }: { editor: Editor | null }) {
    if (!editor) {
      return null;
    }
  
    const Options = [
      {
        icon: <Heading1 className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        preesed: editor.isActive("heading", { level: 1 }),
      },
      {
        icon: <Heading2 className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        preesed: editor.isActive("heading", { level: 2 }),
      },
      {
        icon: <Heading3 className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        preesed: editor.isActive("heading", { level: 3 }),
      },
      {
        icon: <Bold className="size-4" />,
        onClick: () => editor.chain().focus().toggleBold().run(),
        preesed: editor.isActive("bold"),
      },
      {
        icon: <Italic className="size-4" />,
        onClick: () => editor.chain().focus().toggleItalic().run(),
        preesed: editor.isActive("italic"),
      },
      {
        icon: <Strikethrough className="size-4" />,
        onClick: () => editor.chain().focus().toggleStrike().run(),
        preesed: editor.isActive("strike"),
      },
      {
        icon: <AlignLeft className="size-4" />,
        onClick: () => editor.chain().focus().setTextAlign("left").run(),
        preesed: editor.isActive({ textAlign: "left" }),
      },
      {
        icon: <AlignCenter className="size-4" />,
        onClick: () => editor.chain().focus().setTextAlign("center").run(),
        preesed: editor.isActive({ textAlign: "center" }),
      },
      {
        icon: <AlignRight className="size-4" />,
        onClick: () => editor.chain().focus().setTextAlign("right").run(),
        preesed: editor.isActive({ textAlign: "right" }),
      },
      {
        icon: <List className="size-4" />,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        preesed: editor.isActive("bulletList"),
      },
      {
        icon: <ListOrdered className="size-4" />,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        preesed: editor.isActive("orderedList"),
      },
      {
        icon: <Highlighter className="size-4" />,
        onClick: () => editor.chain().focus().toggleHighlight().run(),
        preesed: editor.isActive("highlight"),
      },
      {
        icon: <Underline className="size-4" />,
        onClick: () => editor.chain().focus().toggleUnderline().run(),
        preesed: editor.isActive("underline"),
      },
      {
        icon: <Link className="size-4" />,
        onClick: () => {
          const url = window.prompt("URL")?.trim();
          if (url) {
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          } else {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
          }
        },
        preesed: editor.isActive("link"),
      },
    ];
  
    return (
      <div className="border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50">
        {Options.map((option, index) => (
          <Toggle
            key={index}
            pressed={option.preesed}
            onPressedChange={option.onClick}
          >
            {option.icon}
          </Toggle>
        ))}
  
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Table className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Table</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                        .run()
                    }
                  >
                    Create
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      editor.chain().focus().deleteTable().run();
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Row</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => {
                      editor.chain().focus().addRowBefore().run();
                    }}
                  >
                    Insert before
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      editor.chain().focus().addRowAfter().run();
                    }}
                  >
                    Insert after
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      editor.chain().focus().deleteRow().run();
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Columns</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => {
                      editor.chain().focus().addColumnBefore().run();
                    }}
                  >
                    Insert before
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      editor.chain().focus().addColumnAfter().run();
                    }}
                  >
                    Insert after
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      editor.chain().focus().deleteColumn().run();
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Cell</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => {
                      editor.chain().focus().mergeCells().run();
                    }}
                  >
                    Merge
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      editor.chain().focus().splitCell().run();
                    }}
                  >
                    Split
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      editor.chain().focus().toggleHeaderCell().run();
                    }}
                  >
                    Toggle
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
  