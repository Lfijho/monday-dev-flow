import { createContext, useContext, useState } from 'react';

// BacklogContext provides backlog state and management
const BacklogContext = createContext(undefined);

const initialGroups = [
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
        assignee: 'Gustavo',
        status: 'done',
        priority: 'high',
        type: 'technical-debt',
        dueDate: '2025-07-18',
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

export function BacklogProvider({ children }) {
  const [groups, setGroups] = useState(initialGroups);
  const [currentView, setCurrentView] = useState('table');
  const [filters, setFilters] = useState({});

  const addItemFromIdea = (idea) => {
    const sanitizedDescription = idea.description.replace(/[➢✔➔]/g, ''); 

    const newItem = {
      id: Date.now().toString(),
      title: idea.title,
      description: sanitizedDescription,
      assignee: undefined,
      status: 'todo',
      priority: idea.impact,
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

  const addItemFromSupportBacklog = (submission) => {
    const newItem = {
      id: `SUPP-${Date.now()}`,
      title: submission.title,
      description: submission.description,
      assignee: undefined,
      status: 'todo',
      priority: submission.impact,
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

  const moveItemToGroup = (itemId, targetGroupId, newStatus) => {
    setGroups(prev => {
      let itemToMove = null;
      
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
            ? { ...group, items: [itemToMove, ...group.items] }
            : group
        );
      }
      
      return updatedGroups;
    });
  };

  const updateItemStatus = (itemId, newStatus) => {
    setGroups(prev => {
      const newGroups = prev.map(group => ({
        ...group,
        items: group.items.map(item =>
          item.id === itemId
            ? { ...item, status: newStatus, updatedAt: new Date().toISOString() }
            : item
        )
      }));
      return [...newGroups];
    });
  };

  const updateItemAssignee = (itemId, newAssignee) => {
    setGroups(prev => {
      const newGroups = prev.map(group => ({
        ...group,
        items: group.items.map(item =>
          item.id === itemId
            ? { ...item, assignee: newAssignee, updatedAt: new Date().toISOString() }
            : item
        )
      }));
      return [...newGroups];
    });
  };

  const addComment = (itemId, comment, author = 'Usuário Atual') => {
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

  const updateItem = (itemId, updates) => {
    setGroups(prev => prev.map(group => ({
      ...group,
      items: group.items.map(item =>
        item.id === itemId
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      )
    })));
  };

  const deleteItem = (itemId, softDelete = true) => {
    if (softDelete) {
        updateItem(itemId, { softDeleted: true });
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