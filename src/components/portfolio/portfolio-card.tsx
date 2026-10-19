import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PortfolioCoin } from '@/types/crypto.types';
import { AnalysisPanel } from '@/components/crypto/analysis-panel';
import { QuotePanel } from '@/components/crypto/quote-panel';

interface PortfolioCardProps {
  coin: PortfolioCoin;
  onRemove: (id: string) => Promise<void>;
}

export function PortfolioCard({ coin, onRemove }: PortfolioCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);

    try {
      await onRemove(coin.id);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Card className="h-full gap-4">
      <CardHeader className="gap-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={coin.image}
              alt=""
              width={40}
              height={40}
              loading="lazy"
              className="size-10 rounded-full"
            />
            <div className="min-w-0">
              <CardTitle className="truncate text-base">{coin.name}</CardTitle>
              <p className="text-xs text-muted-foreground uppercase">
                {coin.symbol} · Rank #{coin.rank ?? '—'}
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isRemoving}
                aria-label={`Eliminar ${coin.name} de tu portfolio`}
              >
                <Trash2 className="text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar {coin.name}</AlertDialogTitle>
                <AlertDialogDescription>
                  Se quitara {coin.name} de tu portfolio personal. Esta accion no afecta tus fondos
                  reales.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    void handleRemove();
                  }}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <QuotePanel symbol={coin.symbol} />

        <Tabs defaultValue="technical">
          <TabsList>
            <TabsTrigger value="technical">Analisis tecnico</TabsTrigger>
            <TabsTrigger value="fundamental">Analisis fundamental</TabsTrigger>
          </TabsList>

          <TabsContent value="technical" className="pt-4">
            <AnalysisPanel
              kind="technical"
              coinId={coin.id}
              symbol={coin.symbol}
              ctaLabel="analisis tecnico"
            />
          </TabsContent>

          <TabsContent value="fundamental" className="pt-4">
            <AnalysisPanel
              kind="fundamental"
              coinId={coin.id}
              symbol={coin.symbol}
              ctaLabel="analisis fundamental"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
