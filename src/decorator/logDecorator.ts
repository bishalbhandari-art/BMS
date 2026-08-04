export function LogAction(_target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    console.log(`[LOG] Executing ${propertyKey}...`);
   try {
       const result = await originalMethod.apply(this, args);
       console.log(`[LOG] Finished ${propertyKey}.`);
       return result;
     } catch (err) {
       console.log(`[LOG] Failed ${propertyKey}.`);
       throw err;
     }
  };
  return descriptor;
}
