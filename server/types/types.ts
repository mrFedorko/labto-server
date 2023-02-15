type HistoryAction = 
    'addReag' | 
    'takeReag' | 
    'changeReag' | 
    'isolateReag' | 
    'deleteReag' | 
    'addDraft' | 
    'takeColumn' | 
    'returnColumn' |
    'addColumn'|     // NONONON
    'changeColumn'|     // NONONON
    'isolateColumn'|     // NONONON
    'deleteColumn'|     // NONONON
    'createOrder' |
    'changeOrderStatus'|
    'deleteOrder' |
    'getAllOrders' |
    'redirectOrder' |
    'createReport'|
    'addUser'|
    'deleteUser'|
    'enterSystem' |
    'getUserHistory' | 
    'changeUser' |
    'addOption' |
    'deleteOption' |
    "createProject" |
    "changeProject" |
    "deleteProject" |
    "addColumn"
    ;

type ReagType = 'reag' | 'rs' | 'subst';

type OrderStatus = 'created' | 'processed' | 'executed' | 'completed' | 'canceled' | 'reviced' | 'changed' | 'confirmed'
type OrderRequestStatus = OrderStatus & 'all' | 'active' | 'new' | 'archive'
type Role = 'user' | 'prep' | 'head' | 'admin' | 'developer'