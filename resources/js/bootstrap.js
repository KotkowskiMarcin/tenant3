import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Make route available globally
import { route } from 'ziggy-js';
window.route = route;
