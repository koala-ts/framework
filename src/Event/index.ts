/**
 * @deprecated This module is deprecated in favor of using the Kernel module.
 */
export { httpKernel as eventBusMiddleware } from '@/Kernel/HttpKernel';
export type {
  KernelStorage as EventBusStorage,
  EventEmitter,
  EventSubscriber,
  useEmit,
  useResponse,
  useRequest,
} from '@/Kernel';
