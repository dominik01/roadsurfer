import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import CalendarView from '@/views/CalendarView.vue'
import BookingDetailView from '@/views/BookingDetailView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'calendar',
    component: CalendarView,
  },
  {
    path: '/booking/:id',
    name: 'booking-detail',
    component: BookingDetailView,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
