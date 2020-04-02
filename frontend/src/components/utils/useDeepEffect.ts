import { DependencyList, useEffect, EffectCallback } from 'react';

/**
 * Checks if not object or function; returns true. else returns value === null evaluated. 
 * @param value Value to test
 */
const isPrimitive = (value: any) => (typeof value !== 'object' && typeof value !== 'function') || value === null;

/**
 * Deep check by stringifying non primitive elements of list. if elements are objects then stringify.
 * @param callback callback
 * @param dep dependency list to check
 */
export const useDeepEffect = (callback: EffectCallback, dep: DependencyList) => {
  useEffect(callback, dep.map(d => isPrimitive(d) ? d : JSON.stringify(d)))
};