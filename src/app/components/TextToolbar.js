"use client";

import {
    ALargeSmallIcon,
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    BoldIcon,
    Highlighter,
    ItalicIcon,
    Palette,
    UnderlineIcon,
    Smile,
    XOctagon,
} from "lucide-react";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { useState } from "react";



export default function TextToolbar({ editor }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    if (!editor) {
        return null;
    }

    const handleSetColor = (color) => {
        editor.chain().focus().setColor(color).run();
    };

    const handleHighlightChange = (color) => {
        if (editor) {
            editor.chain().focus().toggleHighlight({ color }).run();
        }
    };
    const handleEmojiSelect = (emoji) => {
        editor.chain().focus().insertContent(emoji.native).run();
        setShowEmojiPicker(false);
    };

    const handleFontSizeChange = (size) => {
        if (editor) {
            editor.chain().focus().setFontSize(size).run();
        }
    };

    return (
        <div className="flex flex-wrap gap-2 border border-primary rounded-md p-3 my-4">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={
                    editor.isActive("bold")
                        ? "is-active border h-6 w-6 rounded-md"
                        : "text-neutral border h-6 w-6 rounded-md"
                }
            >
                <BoldIcon className="h-4 w-4 mx-auto" />
            </button>
            <button
                onClick={() => editor && editor.chain().focus().toggleItalic().run()}
                disabled={!editor || !editor.can().chain().focus().toggleItalic().run()}
                className={editor && editor.isActive("italic") ? "is-active border h-6 w-6 rounded-md" : "text-neutral border h-6 w-6 rounded-md"}
            >
                <ItalicIcon className='h-4 w-4 mx-auto' />
            </button>
            <button
                onClick={() => editor && editor.chain().focus().toggleUnderline().run()}
                disabled={!editor || !editor.can().chain().focus().toggleUnderline().run()}
                className={editor && editor.isActive("underline") ? "is-active border h-6 w-6 rounded-md" : "text-neutral border h-6 w-6 rounded-md"}
            >
                <UnderlineIcon className='h-4 w-4 mx-auto' />
            </button>

            <button
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                className={
                    editor.isActive({ textAlign: "left" })
                        ? "is-active border h-6 w-6 rounded-md"
                        : "text-neutral border h-6 w-6 rounded-md"
                }
            >
                <AlignLeft className="h-4 w-4 mx-auto" />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                className={
                    editor.isActive({ textAlign: "center" })
                        ? "is-active border h-6 w-6 rounded-md"
                        : "text-neutral border h-6 w-6 rounded-md"
                }
            >
                <AlignCenter className="h-4 w-4 mx-auto" />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                className={
                    editor.isActive({ textAlign: "right" })
                        ? "is-active border h-6 w-6 rounded-md"
                        : "text-neutral border h-6 w-6 rounded-md"
                }
            >
                <AlignRight className="h-4 w-4 mx-auto" />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                className={
                    editor.isActive({ textAlign: "justify" })
                        ? "is-active border h-6 w-6 rounded-md"
                        : "text-neutral border h-6 w-6 rounded-md"
                }
            >
                <AlignJustify className="h-4 w-4 mx-auto" />
            </button>

            <div className="flex items-center border border-primary shadow-2xl h-8 rounded-[4px] pl-1">
                <label htmlFor="fontSize" className="cursor-pointer text-neutral">
                    <ALargeSmallIcon className="h-5 w-5 mx-auto" />
                </label>
                <select
                    id="fontSize"
                    name="fontSize"
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                    disabled={!editor}
                    className="ml-2 h-7 bg-base-100 border-l border-primary text-neutral"
                >
                    <option value="8">8px</option>
                    <option value="9">9px</option>
                    <option value="10">10px</option>
                    <option value="11">11px</option>
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                    <option value="20">20px</option>
                    <option value="24">24px</option>
                    <option value="28">28px</option>
                    <option value="32">32px</option>
                    <option value="36">36px</option>
                    <option value="40">40px</option>
                    <option value="44">44px</option>
                </select>
            </div>
            <div className="border border-primary cursor-pointer h-8 w-[60px] rounded-md p-1">
                {editor && (
                    <>
                        <label htmlFor="colorPicker" className='cursor-pointer text-neutral ' >
                            <Palette className="h-5 w-5 mx-auto mt-[2px]" />
                        </label>
                        <input
                            id="colorPicker"
                            type="color"
                            onInput={(event) => handleSetColor(event.target.value)}
                            value={editor.getAttributes('textStyle').color || '#000000'}
                            className='h-4 border-none absolute bg-base-100'
                        />
                    </>
                )}
            </div>
            <div className="border border-primary cursor-pointer h-8 w-[60px] rounded-md p-1">
                {editor && (
                    <>
                        <label htmlFor="highlightPicker" className='cursor-pointer text-neutral'>
                            <Highlighter className="h-5 w-5 mx-auto mt-[2px]" />
                        </label>
                        <input
                            id="highlightPicker"
                            type="color"
                            onInput={(event) => handleHighlightChange(event.target.value)}
                            value="#FFFF00"
                            className='h-4 border-none absolute bg-base-100'
                        />
                    </>
                )}
            </div>

            <div>
                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                    {showEmojiPicker ? (
                        <div className="text-red-700 mr-2 rounded-[50%]">
                            <XOctagon />
                        </div>
                    ) : (
                        <p className="border rounded-md border-primary px-2 pt-[2px] h-8">
                            <Smile className="h-6 w-6 text-neutral" />
                        </p>
                    )}
                </button>
                {showEmojiPicker && <Picker onSelect={handleEmojiSelect} />}
            </div>
        </div>
    );
}