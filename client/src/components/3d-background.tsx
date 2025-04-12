import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1500;
    
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    
    // Create an array of colors for particles
    const colors = [
      new THREE.Color('#60A5FA'), // blue-400
      new THREE.Color('#93C5FD'), // blue-300
      new THREE.Color('#A5B4FC'), // indigo-300
      new THREE.Color('#67E8F9'), // cyan-300
      new THREE.Color('#22D3EE')  // cyan-400
    ];
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position particles in a cube
      posArray[i] = (Math.random() - 0.5) * 60;
      posArray[i + 1] = (Math.random() - 0.5) * 60;
      posArray[i + 2] = (Math.random() - 0.5) * 60;
      
      // Add color variations by randomly selecting from colors array
      const selectedColor = colors[Math.floor(Math.random() * colors.length)];
      const intensity = 0.7 + Math.random() * 0.3; // Brighter intensity
      colorArray[i] = selectedColor.r * intensity;
      colorArray[i + 1] = selectedColor.g * intensity;
      colorArray[i + 2] = selectedColor.b * intensity;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1
      };
    };

    // Attach event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !particlesRef.current) return;
      
      // Rotate particles
      particlesRef.current.rotation.x += 0.0003;
      particlesRef.current.rotation.y += 0.0005;
      
      // Move particles based on mouse position
      particlesRef.current.rotation.x += mousePosition.current.y * 0.0005;
      particlesRef.current.rotation.y += mousePosition.current.x * 0.0005;
      
      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      
      // Schedule next frame
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    requestRef.current = requestAnimationFrame(animate);

    // Cleanup function
    return () => {
      cancelAnimationFrame(requestRef.current as number);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      
      scene.remove(particles);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []); // Empty deps array to run only once on mount

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-full h-full -z-10">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  );
}