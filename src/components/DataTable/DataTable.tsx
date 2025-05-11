"use client";

import React from "react";
import {
    ColumnDef,
    flexRender,
    useReactTable,
    getCoreRowModel,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type DataTableProps<T> = {
    title: string;
    data: T[];
    columns: ColumnDef<T>[];
};

export const DataTable = <T,>({ title, data, columns }: DataTableProps<T>) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-lg border border-gray-300 shadow-md bg-white">
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h2 className="text-lg font-semibold text-gray-700 font-poppins">{title}</h2>
            </div>
            <Table className="w-full">
                <TableHeader className="bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="text-left text-sm font-medium text-gray-600 uppercase tracking-wider px-4 py-3"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row, rowIndex) => (
                            <TableRow
                                key={row.id}
                                className={`${rowIndex % 2 === 0
                                    ? "bg-white"
                                    : "bg-gray-50"
                                    } hover:bg-gray-100 transition-colors`}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="px-4 py-3 text-sm text-gray-700"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="text-center px-4 py-6 text-gray-500"
                            >
                                Sem dados disponíveis.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <p className="text-sm text-gray-600">
                    Mostrando {table.getRowModel().rows.length} de{" "}
                    {data.length} registros.
                </p>
            </div>
        </div>
    );
};
