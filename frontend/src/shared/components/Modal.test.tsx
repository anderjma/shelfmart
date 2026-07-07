import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal", () => {
    it("renders nothing when isOpen is false", () => {
        render(
            <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
                <p>Content</p>
            </Modal>
        );

        expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
        expect(screen.queryByText("Content")).not.toBeInTheDocument();
    });

    it("renders the title and children when isOpen is true", () => {
        render(
            <Modal isOpen onClose={vi.fn()} title="Test Modal">
                <p>Content</p>
            </Modal>
        );

        expect(screen.getByText("Test Modal")).toBeInTheDocument();
        expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("calls onClose when the backdrop is clicked", () => {
        const onClose = vi.fn();
        render(
            <Modal isOpen onClose={onClose} title="Test Modal">
                <p>Content</p>
            </Modal>
        );

        fireEvent.click(screen.getByRole("presentation"));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when the close button is clicked", () => {
        const onClose = vi.fn();
        render(
            <Modal isOpen onClose={onClose} title="Test Modal">
                <p>Content</p>
            </Modal>
        );

        fireEvent.click(screen.getByLabelText("Close"));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when the Escape key is pressed", () => {
        const onClose = vi.fn();
        render(
            <Modal isOpen onClose={onClose} title="Test Modal">
                <p>Content</p>
            </Modal>
        );

        fireEvent.keyDown(document, { key: "Escape" });

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
