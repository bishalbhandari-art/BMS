export function LogAction(_target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    console.log(`[LOG] Executing ${propertyKey}...`);
    const result = await originalMethod.apply(this, args);
    console.log(`[LOG] Finished ${propertyKey}.`);
    return result;
  };
  return descriptor;
}
