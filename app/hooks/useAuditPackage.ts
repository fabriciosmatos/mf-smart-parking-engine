import JSZip from 'jszip';
import { RaffleResult, Unit, ParkingSpace } from '../types';

/**
 * Hook: Geração de Pacote de Auditoria
 * 
 * Responsável por criar um arquivo ZIP contendo todos os
 * artefatos necessários para auditoria do sorteio:
 * - CSVs de entrada
 * - Mapa final de garagem
 * - Relatório de justificativas
 * - Log completo de auditoria
 * - Certificado de conformidade
 */
export const useAuditPackage = () => {
  /**
   * Gera e faz download do pacote completo de auditoria
   * 
   * Cria um arquivo ZIP contendo:
   * 1. entrada_unidades.csv - Dados de entrada das unidades
   * 2. entrada_vagas.csv - Dados de entrada das vagas
   * 3. 1_Mapa_Final_Garagem.csv - Mapeamento final apto→vaga
   * 4. 2_Relatorio_Justificativa.json - Explicação detalhada por unidade
   * 5. 3_Log_Auditoria.txt - Log completo passo a passo
   * 6. 4_Certificado_Conformidade.json - Certificado com hash e métricas
   */
  const generateAuditPackage = async (
    result: RaffleResult,
    units: Unit[],
    spaces: ParkingSpace[],
    rawUnitsCsv: string,
    rawSpacesCsv: string
  ): Promise<void> => {
    try {
      const zip = new JSZip();

      zip.file('entrada_unidades.csv', rawUnitsCsv);
      zip.file('entrada_vagas.csv', rawSpacesCsv);

      const mapContent = "Apto;Bloco;Vaga;Score;Atributos\n" + 
        result.assignments.map(a => {
          const unit = units.find(u => u.id === a.unitId)!;
          const space = spaces.find(s => s.id === a.spaceId)!;
          return `${unit.apartment};${unit.block};${space.number};${a.score.toFixed(1)};${space.coverage}|${space.access}`;
        }).join('\n');
      zip.file('1_Mapa_Final_Garagem.csv', mapContent);

      const justifications = result.assignments.map(a => {
        const unit = units.find(u => u.id === a.unitId)!;
        const space = spaces.find(s => s.id === a.spaceId)!;
        return {
          unidade: unit.apartment,
          vaga: space.number,
          score: a.score,
          regras: a.rulesApplied
        };
      });
      zip.file('2_Relatorio_Justificativa.json', JSON.stringify(justifications, null, 2));

      zip.file('3_Log_Auditoria.txt', result.log.join('\n'));

      const cert = {
        timestamp: result.timestamp,
        seed: result.seed,
        integrity_hash: result.hash,
        metrics: result.stats,
        compliance_version: "SPE_V2.5_CORE"
      };
      zip.file('4_Certificado_Conformidade.json', JSON.stringify(cert, null, 2));

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SPE_AUDITORIA_${result.hash}.zip`;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1500);
    } catch (err) {
      console.error("Erro ao gerar pacote ZIP:", err);
      alert("Erro ao processar download do pacote de auditoria.");
    }
  };

  return { generateAuditPackage };
};
