import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfissionalSobrecarga } from "@/types/supabase";

interface OverloadTableProps {
  data: ProfissionalSobrecarga[];
  loading?: boolean;
}

export function OverloadTable({ data, loading }: OverloadTableProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Detalhe da Sobrecarga</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead className="text-right">Horas na Semana</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Nenhum profissional em sobrecarga
                  </TableCell>
                </TableRow>
              ) : (
                data.map((profissional, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{profissional.nome}</TableCell>
                    <TableCell>{profissional.cargo}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {profissional.horas_na_semana}h
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
