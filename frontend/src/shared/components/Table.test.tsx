import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Table from "./Table";
import type { TableColumn } from "./Table";

interface Row {
    id: string;
    name: string;
}

const columns: TableColumn<Row>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" }
];

describe("Table", () => {
    it("renders one row per data item", () => {
        const data: Row[] = [
            { id: "1", name: "Alice" },
            { id: "2", name: "Bob" }
        ];

        render(<Table columns={columns} data={data} keyExtractor={(row) => row.id} />);

        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    it("uses the render function when provided", () => {
        const data: Row[] = [{ id: "1", name: "Alice" }];
        const customColumns: TableColumn<Row>[] = [
            { key: "name", header: "Name", render: (row) => `Custom: ${row.name}` }
        ];

        render(<Table columns={customColumns} data={data} keyExtractor={(row) => row.id} />);

        expect(screen.getByText("Custom: Alice")).toBeInTheDocument();
    });

    it("renders skeleton rows when isLoading is true", () => {
        const { container } = render(
            <Table columns={columns} data={[]} keyExtractor={(row) => row.id} isLoading />
        );

        expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
    });

    it("renders the empty message when data is empty and not loading", () => {
        render(
            <Table columns={columns} data={[]} keyExtractor={(row) => row.id} emptyMessage="Nothing here." />
        );

        expect(screen.getByText("Nothing here.")).toBeInTheDocument();
    });
});
