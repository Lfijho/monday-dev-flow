import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BacklogGroup, BacklogItem, FilterState, ViewMode, IdeaSubmission, TaskStatus } from '@/types/backlog';


export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}


export interface CustomBacklogItem extends BacklogItem {
  tags?: string[];
  softDeleted?: boolean; 
}


interface BacklogContextType {
  groups: BacklogGroup[];
  setGroups: React.Dispatch<React.SetStateAction<BacklogGroup[]>>;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  addItemFromIdea: (idea: IdeaSubmission) => void;
  addItemFromSupportBacklog: (submission: any) => void;
  updateItemStatus: (itemId: string, newStatus: TaskStatus) => void;
  updateItemAssignee: (itemId: string, newAssignee: string) => void;
  addComment: (itemId: string, comment: string, author: string) => void;
  updateItem: (itemId: string, updates: Partial<BacklogItem>) => void;
  deleteItem: (itemId: string, softDelete?: boolean) => void;
  moveItemToGroup: (itemId: string, targetGroupId: string, newStatus?: TaskStatus) => void;
}

const BacklogContext = createContext<BacklogContextType | undefined>(undefined);


const initialGroups: BacklogGroup[] = [
  {
    id: 'new-ideas',
    title: 'Novas Ideias (Features e Upsells)',
    color: '#ff6b6b',
    collapsed: false,
    items: [
      {
        id: 'IDEA-01',
        title: 'Automação Avançada no Classificador',
        description: 'Cliente solicitou automação de regras no classificador. Lembrar que isso é um upsell e deve ser validado com a equipe de Relacionamento/CS antes de iniciar o desenvolvimento.',
        assignee: undefined,
        status: 'todo',
        priority: 'medium',
        type: 'feature',
        epic: 'Features (Venda)',
        groupId: 'new-ideas',
        createdAt: '2025-07-20T10:00:00Z',
        updatedAt: '2025-07-21T11:00:00Z',
        comments: [
          {id: 'c1', author: 'Equipe CS', content: 'Contrato validado. Podemos prosseguir com a proposta técnica.', createdAt: '2025-07-21T11:00:00Z'}
        ],
        tags: ['upsell', 'classificador', 'automação']
      }
    ]
  },
  {
    id: 'support-backlog',
    title: 'Backlog de Suporte',
    color: '#f39c12',
    collapsed: false,
    items: []
  },
  {
    id: 'current-sprint',
    title: 'Sprint Atual (25/07 - 08/08)',
    color: '#45b7d1',
    collapsed: false,
    items: [
      {
        id: 'TASK-201',
        title: "Relatórios grandes quebram com erro de JSON",
        description: "Relatórios de longo período (ex: 'Relatório de Horas') estouram o limite de memória do servidor, retornando 'SyntaxError: Unexpected end of JSON input'. Implementar paginação ou streaming de dados na exportação.",
        assignee: 'Gustavo',
        status: 'doing',
        priority: 'high',
        type: 'bug',
        dueDate: '2025-08-05',
        estimate: 8,
        epic: 'Relatórios',
        groupId: 'current-sprint',
        createdAt: '2025-07-24T11:20:00Z',
        updatedAt: '2025-07-25T15:30:00Z',
        comments: [
            {id: 'c2', author: 'Suporte', content: 'Cliente FM Advogados reportou novamente hoje. Precisamos de uma solução definitiva.', createdAt: '2025-07-25T14:00:00Z'}
        ],
        tags: ['relatórios', 'json', 'memória', 'performance']
      },
      {
        id: 'TASK-202',
        title: "Filtros do Dashboard não são herdados do módulo",
        description: "Adicionar um campo como filtro no `adm módulos` do Contencioso, mas ele não aparece na criação de widgets no Dashboard. Revisar a lógica de herança de filtros.",
        assignee: 'Roger',
        status: 'review',
        priority: 'medium',
        type: 'feature',
        dueDate: '2025-08-01',
        estimate: 5,
        epic: 'Dashboards',
        groupId: 'current-sprint',
        createdAt: '2025-07-23T13:10:00Z',
        updatedAt: '2025-07-25T10:00:00Z',
        comments: [],
        tags: ['dashboard', 'filtros', 'adm módulos']
      }
    ]
  },
  {
    id: 'done',
    title: 'Concluído (Últimos 30 dias)',
    color: '#96ceb4',
    collapsed: true,
    items: [
      {
        id: 'DONE-301',
        title: 'Corrigir falha de autenticação SSH em servidor de homologação',
        description: 'A chave `pem-server-homolog.pem` estava com permissões incorretas (chmod) e no diretório errado. Documentado o procedimento correto para a equipe de suporte.',
        assignee: 'Gustavo', // Infra
        status: 'done',
        priority: 'high',
        type: 'technical-debt',
        dueDate: '2025-07-18',
        estimate: 3,
        epic: 'DevOps',
        groupId: 'done',
        createdAt: '2025-07-17T08:00:00Z',
        updatedAt: '2025-07-18T17:00:00Z',
        comments: [],
        tags: ['ssh', 'infra', 'devops']
      }
    ]
  }
];

export function BacklogProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<BacklogGroup[]>(initialGroups);
  const [currentView, setCurrentView] = useState<ViewMode>('table');
  const [filters, setFilters] = useState<FilterState>({});

  const addItemFromIdea = (idea: IdeaSubmission) => {
    const sanitizedDescription = idea.description.replace(/[➢✔➔]/g, ''); 

    const newItem: BacklogItem = {
      id: Date.now().toString(),
      title: idea.title,
      description: sanitizedDescription,
      assignee: undefined,
      status: 'todo',
      priority: idea.impact as any,
      type: 'feature',
      groupId: 'new-ideas',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [
        {
          id: Date.now().toString() + '-comment',
          author: `Dept. ${idea.department}`,
          content: `Nova ideia submetida. Impacto: ${idea.impact}`,
          createdAt: new Date().toISOString()
        }
      ]
    };

    setGroups(prev => prev.map(group =>
      group.id === 'new-ideas'
        ? { ...group, items: [newItem, ...group.items] }
        : group
    ));
  };

  const addItemFromSupportBacklog = (submission: any) => {
    const newItem: BacklogItem = {
      id: `SUPP-${Date.now()}`,
      title: submission.title,
      description: submission.description,
      assignee: undefined,
      status: 'todo',
      priority: submission.impact as any,
      type: 'bug',
      groupId: 'support-backlog',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [
        {
          id: Date.now().toString() + '-comment',
          author: `Cliente: ${submission.department || 'INTERNO'}`,
          content: `Solicitação de suporte. Link: ${submission.link}${submission.ticketId ? ` | Ticket: ${submission.ticketId}` : ''}`,
          createdAt: new Date().toISOString()
        }
      ]
    };

    setGroups(prev => prev.map(group =>
      group.id === 'support-backlog'
        ? { ...group, items: [newItem, ...group.items] }
        : group
    ));
  };

  const moveItemToGroup = (itemId: string, targetGroupId: string, newStatus?: TaskStatus) => {
    setGroups(prev => {
      let itemToMove: BacklogItem | null = null;
      
      // Find and remove item from current group
      const updatedGroups = prev.map(group => ({
        ...group,
        items: group.items.filter(item => {
          if (item.id === itemId) {
            itemToMove = { 
              ...item, 
              groupId: targetGroupId,
              status: newStatus || item.status,
              updatedAt: new Date().toISOString()
            };
            return false;
          }
          return true;
        })
      }));

      // Add item to target group
      if (itemToMove) {
        return updatedGroups.map(group =>
          group.id === targetGroupId
            ? { ...group, items: [itemToMove!, ...group.items] }
            : group
        );
      }
      
      return updatedGroups;
    });
  };

  const updateItemStatus = (itemId: string, newStatus: TaskStatus) => {
    setGroups(prev => prev.map(group => ({
      ...group,
      items: group.items.map(item =>
        item.id === itemId
          ? { ...item, status: newStatus, updatedAt: new Date().toISOString() }
          : item
      )
    })));
  };

  const updateItemAssignee = (itemId: string, newAssignee: string) => {
    setGroups(prev => prev.map(group => ({
      ...group,
      items: group.items.map(item =>
        item.id === itemId
          ? { ...item, assignee: newAssignee, updatedAt: new Date().toISOString() }
          : item
      )
    })));
  };

  const addComment = (itemId: string, comment: string, author: string = 'Usuário Atual') => {
   
    const newComment = {
      id: Date.now().toString(),
      author,
      content: comment,
      createdAt: new Date().toISOString()
    };

    setGroups(prev => prev.map(group => ({
      ...group,
      items: group.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              comments: [...(item.comments || []), newComment], 
              updatedAt: new Date().toISOString()
            }
          : item
      )
    })));
  };

  const updateItem = (itemId: string, updates: Partial<BacklogItem>) => {
    setGroups(prev => prev.map(group => ({
      ...group,
      items: group.items.map(item =>
        item.id === itemId
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      )
    })));
  };

  const deleteItem = (itemId: string, softDelete: boolean = true) => {
    
    if (softDelete) {
        updateItem(itemId, { softDeleted: true } as Partial<BacklogItem>);
    } else {
        // Hard delete
        setGroups(prev => prev.map(group => ({
            ...group,
            items: group.items.filter(item => item.id !== itemId)
        })));
    }
  };


  return (
    <BacklogContext.Provider value={{
      groups,
      setGroups,
      currentView,
      setCurrentView,
      filters,
      setFilters,
      addItemFromIdea,
      addItemFromSupportBacklog,
      updateItemStatus,
      updateItemAssignee,
      addComment,
      updateItem,
      deleteItem,
      moveItemToGroup
    }}>
      {children}
    </BacklogContext.Provider>
  );
}

export function useBacklog() {
  const context = useContext(BacklogContext);
  if (context === undefined) {
   
    throw new Error('useBacklog must be used within a BacklogProvider');
  }
  return context;
}