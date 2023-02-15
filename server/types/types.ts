type HistoryAction = 
    'addReag' | 
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
    'changeUser' |
    'addOption' |
    'deleteOption' |
    "createProject" |
    "changeProjectStatus" |
    "deleteProject" |
    "addColumn"
    ;

type ReagType = 'reag' | 'rs' | 'subst';

type OrderStatus = 'created' | 'processed' | 'executed' | 'completed' | 'canceled' | 'reviced' | 'changed' | 'confirmed'
type OrderRequestStatus = OrderStatus & 'all' | 'active' | 'new' | 'archive'
type Role = 'user' | 'prep' | 'head' | 'admin' | 'developer'