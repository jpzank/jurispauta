import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ContentCreator } from './ContentCreator';
import { ContentPreview } from './ContentPreview';

beforeEach(() => {
  window.localStorage.clear();
  window.dispatchEvent(new StorageEvent('storage', { key: null }));
});

describe('content form accessibility', () => {
  it('associates each creator label with its interactive control', () => {
    render(<ContentCreator />);

    expect(screen.getByLabelText('Área de Atuação')).toHaveAttribute('role', 'combobox');
    expect(screen.getByLabelText('Objetivo do conteúdo')).toBeInTheDocument();
    expect(screen.getByLabelText('Formato')).toBeInTheDocument();
  });

  it('gives the publication date picker an accessible name', () => {
    render(
      <ContentPreview
        content={{ title: 'Pauta fictícia', content: 'Conteúdo fictício.' }}
        format="carrossel"
        isGenerating={false}
        onApprove={() => undefined}
        onRegenerate={() => undefined}
      />,
    );

    expect(screen.getByLabelText('Data de Publicação')).toBeInTheDocument();
  });
});
