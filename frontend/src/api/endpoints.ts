export const API_BASE_URL = 'http://localhost:6969';

export const ENDPOINTS = {
    REGISTER: '/register-user',
    LOGIN: '/login-user',
    PRODUCTS: '/products',
    PRODUCT_DETAILS: (id: string) => `/products/${id}`,
    PURCHASE: '/purchase-product',
    TOTAL_AMOUNT: (orderId: string) => `/total-amount/${orderId}`,
    MOCK_PAYMENT_SUCCESS: '/mock-payment/success',
    MOCK_PAYMENT_FAIL: '/mock-payment/simulateFail',
    MOCK_PAYMENT_ABORT: '/mock-payment/abort',
    GET_USER_BY_ID: `/get-user-data`,
};
