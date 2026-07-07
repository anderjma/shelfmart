import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
    it("renders its children text", () => {
        render(<Button>Save</Button>);
        expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("calls onClick when clicked and not disabled", () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Save</Button>);

        fireEvent.click(screen.getByText("Save"));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
        const onClick = vi.fn();
        render(
            <Button onClick={onClick} disabled>
                Save
            </Button>
        );

        fireEvent.click(screen.getByText("Save"));

        expect(onClick).not.toHaveBeenCalled();
    });

    it("does not call onClick when isLoading", () => {
        const onClick = vi.fn();
        render(
            <Button onClick={onClick} isLoading>
                Save
            </Button>
        );

        fireEvent.click(screen.getByText("Save"));

        expect(onClick).not.toHaveBeenCalled();
    });

    it("applies the danger variant class", () => {
        render(<Button variant="danger">Delete</Button>);
        expect(screen.getByText("Delete")).toHaveClass("text-red-600");
    });
});
