import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react-webpack5";
import { SlideRenderer } from "../components/Slides/SlideRenderer";
import "../components/Slides/SlideRenderer.css";

const meta: Meta<typeof SlideRenderer> = {
  title: "Components/SlideRenderer",
  component: SlideRenderer,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SlideRenderer>;

export const markdownEditor: Story = {
  render: () => {
    const [content, setContent] = useState<string>(
      "# Welcome to Slide\n\n**Bold text**, _italic text_, and `inline code`."
    );

    return (
      <SlideRenderer
        content={content}
        onChange={(updatedContent) => setContent(updatedContent)}
      />
    );
  },
};
