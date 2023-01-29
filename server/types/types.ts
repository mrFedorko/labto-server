type HistoryAction = 'addReag' | 
    'takeReag' | 
    'changeReag' | 
    'isolateReag' | 
    'deleteReag' | 
    'addDraft' | 
    'takeColumn' | 
    'returnColumn' |
    'createOrder' |
    'changeOrderStatus'|
    'deleteOrder' |
    'getAllOrders' |
    'createReport'|
    'addUser'|
    'deleteUser'|
    'enterSystem' |
    'getUserHistory' | 
    'changeUser'
    ;

type ReagType = 'reag' | 'rs' | 'subst';

type OrderStatus = 'created' | 'processed' | 'executed' | 'completed' | 'canceled' | 'reviced' | 'changed' | 'confirmed'
type OrderRequestStatus = OrderStatus & 'all' | 'active' | 'new' | 'archive'