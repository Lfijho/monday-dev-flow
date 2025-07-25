import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BacklogGroup, BacklogItem, FilterState, ViewMode, IdeaSubmission, TaskStatus } from '@/types/backlog';

interface BacklogContextType {
  groups: BacklogGroup[];
  setGroups: React.Dispatch<React.SetStateAction<BacklogGroup[]>>;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  addItemFromIdea: (idea: IdeaSubmission) => void;
  updateItemStatus: (itemId: string, newStatus: TaskStatus) => void;
  addComment: (itemId: string, comment: string) => void;
  updateItem: (itemId: string, updates: Partial<BacklogItem>) => void;
  deleteItem: (itemId: string) => void;
}

const BacklogContext = createContext<BacklogContextType | undefined>(undefined);

const initialGroups: BacklogGroup[] = [
  {
    id: 'new-ideas',
    title: 'Novas Ideias',
    color: '#ff6b6b',
    collapsed: false,
    items: [
      {
        id: '1',
        title: 'Sistema de notificações push',
        description: 'Implementar notificações em tempo real para melhorar engajamento',
        assignee: 'João Silva',
        status: 'todo',
        priority: 'medium',
        type: 'feature',
        dueDate: '2024-02-15',
        estimate: 8,
        epic: 'Experiência do Usuário',
        groupId: 'new-ideas',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z',
        comments: []
      }
    ]
  },
  {
    id: 'backlog',
    title: 'Backlog',
    color: '#4ecdc4',
    collapsed: false,
    items: [
      {
        id: '2',
        title: 'Refatorar sistema de autenticação',
        description: 'Melhorar segurança e performance do login',
        assignee: 'Maria Santos',
        status: 'todo',
        priority: 'high',
        type: 'technical-debt',
        dueDate: '2024-02-20',
        estimate: 13,
        epic: 'Infraestrutura',
        groupId: 'backlog',
        createdAt: '2024-01-08T14:30:00Z',
        updatedAt: '2024-01-08T14:30:00Z',
        comments: [
          {
            id: 'c1',
            author: 'Pedro Costa',
            content: 'Precisamos considerar migração para OAuth 2.0',
            createdAt: '2024-01-09T09:15:00Z'
          }
        ]
      }
    ]
  },
  {
    id: 'current-sprint',
    title: 'Sprint Atual',
    color: '#45b7d1',
    collapsed: false,
    items: [
      {
        id: '3',
        title: 'Corrigir bug no formulário de cadastro',
        description: 'Campo de email não valida corretamente',
        assignee: 'Ana Oliveira',
        status: 'doing',
        priority: 'high',
        type: 'bug',
        dueDate: '2024-01-25',
        estimate: 3,
        epic: 'Correções Críticas',
        groupId: 'current-sprint',
        createdAt: '2024-01-15T11:20:00Z',
        updatedAt: '2024-01-20T16:45:00Z',
        comments: []
      },
      {
        id: '4',
        title: 'Implementar dashboard de analytics',
        description: 'Dashboard com métricas principais do produto',
        assignee: 'Carlos Lima',
        status: 'review',
        priority: 'medium',
        type: 'feature',
        dueDate: '2024-01-30',
        estimate: 21,
        epic: 'Analytics',
        groupId: 'current-sprint',
        createdAt: '2024-01-12T13:10:00Z',
        updatedAt: '2024-01-22T10:30:00Z',
        comments: []
      }
    ]
  },
  {
    id: 'done',
    title: 'Concluído',
    color: '#96ceb4',
    collapsed: true,
    items: [
      {
        id: '5',
        title: 'Configurar CI/CD pipeline',
        description: 'Pipeline automatizado para deploy',
        assignee: 'Roberto Silva',
        status: 'done',
        priority: 'high',
        type: 'technical-debt',
        dueDate: '2024-01-15',
        estimate: 8,
        epic: 'DevOps',
        groupId: 'done',
        createdAt: '2024-01-01T08:00:00Z',
        updatedAt: '2024-01-15T17:00:00Z',
        comments: []
      }
    ]
  }
];

export function BacklogProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<BacklogGroup[]>(initialGroups);
  const [currentView, setCurrentView] = useState<ViewMode>('table');
  const [filters, setFilters] = useState<FilterState>({});

  const addItemFromIdea = (idea: IdeaSubmission) => {
    const newItem: BacklogItem = {
      id: Date.now().toString(),
      title: idea.title,
      description: idea.description,
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
          content: `Nova ideia submetida pelo departamento ${idea.department}. Impacto percebido: ${idea.impact}`,
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

  const addComment = (itemId: string, comment: string) => {
    const newComment = {
      id: Date.now().toString(),
      author: 'Usuário Atual',
      content: comment,
      createdAt: new Date().toISOString()
    };

    setGroups(prev => prev.map(group => ({
      ...group,
      items: group.items.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              comments: [...item.comments, newComment],
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

  const deleteItem = (itemId: string) => {
    setGroups(prev => prev.map(group => ({
      ...group,
      items: group.items.filter(item => item.id !== itemId)
    })));
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
      updateItemStatus,
      addComment,
      updateItem,
      deleteItem
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