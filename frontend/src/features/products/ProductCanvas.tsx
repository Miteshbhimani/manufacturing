import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Float, Center } from "@react-three/drei";
import { Suspense } from "react";

function Model() {
  return (
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[1.5, 1.5, 3, 32]} />
      <meshStandardMaterial color="#0b3d91" metalness={0.6} roughness={0.4} />
      <mesh position={[0, 1.5, 0]}>
         <cylinderGeometry args={[2, 2, 0.5, 32]} />
         <meshStandardMaterial color="#d32f2f" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
         <cylinderGeometry args={[2, 2, 0.5, 32]} />
         <meshStandardMaterial color="#d32f2f" metalness={0.5} roughness={0.5} />
      </mesh>
    </mesh>
  );
}

export function ProductCanvas() {
  return (
    <div className="w-full h-[400px] md:h-[600px] bg-slate-100 border border-gray-300 shadow-inner rounded-sm overflow-hidden relative cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [4, 4, 5], fov: 50 }}>
        <color attach="background" args={["#f8fafc"]} />
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
             <Center>
               <Model />
             </Center>
          </Float>
          <OrbitControls 
            autoRotate 
            autoRotateSpeed={0.5} 
            enableZoom={true} 
            maxDistance={10} 
            minDistance={2} 
            maxPolarAngle={Math.PI / 1.5}
          />
          <Stage environment="city" intensity={0.8} />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-bold text-[#0b3d91] px-4 py-2 rounded-sm border border-gray-200 flex items-center gap-2 shadow-md">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        Interactive 3D Viewer
      </div>
    </div>
  );
}
