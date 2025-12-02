import React, { useState, useEffect, useRef } from 'react';
import { Shield, Users, Globe, Database, AlertTriangle, Play, RefreshCw, Lock, Unlock, Activity, MapPin, Server, Search, XCircle, FileText, DollarSign, Cpu, BookOpen, Info, X } from 'lucide-react';

// --- CONFIGURACIÓN DE ESTILOS Y TEMA ---
const COLORS = {
  background: 'bg-slate-900',
  panel: 'bg-slate-800',
  text: 'text-slate-100',
  accent: 'text-blue-500',
  success: 'text-emerald-400',
  danger: 'text-red-500',
  warning: 'text-amber-400',
  node: {
    user: 'bg-blue-600 ring-blue-400',
    account: 'bg-violet-600 ring-violet-400',
    ip_safe: 'bg-emerald-600 ring-emerald-400',
    ip_danger: 'bg-red-600 ring-red-500',
    resource: 'bg-amber-600 ring-amber-400',
    finance: 'bg-pink-600 ring-pink-400', // Nuevo: Activo Crítico Financiero
  }
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  // Estados del Grafo
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [logs, setLogs] = useState([]);
  
  // Estados de Control
  const [securityStatus, setSecurityStatus] = useState('SECURE'); // SECURE, WARNING, CRITICAL
  const [riskScore, setRiskScore] = useState(0); // 0 a 100
  const [activeScenario, setActiveScenario] = useState('idle'); 
  const [selectedNode, setSelectedNode] = useState(null);
  const [showEduPanel, setShowEduPanel] = useState(false); // Nuevo estado para el panel educativo
  
  // Referencias para temporizadores
  const simulationTimeouts = useRef([]);

  // Inicialización
  useEffect(() => {
    resetGraph();
    return () => clearAllTimeouts();
  }, []);

  const clearAllTimeouts = () => {
    simulationTimeouts.current.forEach(t => clearTimeout(t));
    simulationTimeouts.current = [];
  };

  const addTimeout = (fn, delay) => {
    const t = setTimeout(fn, delay);
    simulationTimeouts.current.push(t);
  };

  // --- LÓGICA DEL GRAFO ---

  const resetGraph = () => {
    clearAllTimeouts();
    const initialNodes = [
      { 
        id: 'u1', type: 'user', label: 'Carlos (Docente)', x: 150, y: 350, icon: Users,
        data: { rol: 'Docente Titular', facultad: 'Medicina Veterinaria', id_empleado: '89021', dispositivo: 'iPhone 13' }
      },
      { 
        id: 'a1', type: 'account', label: 'carlos.vet', x: 300, y: 350, icon: Lock,
        data: { email: 'carlos.vet@correo.unicordoba.edu.co', last_pass_change: '30 días', mfa: 'Desactivado' }
      },
    ];
    const initialLinks = [
      { source: 'u1', target: 'a1', label: 'POSEE_CREDENCIAL', status: 'normal' }
    ];

    setNodes(initialNodes);
    setLinks(initialLinks);
    setLogs([{ time: new Date().toLocaleTimeString(), msg: 'Centro de Operaciones (SOC) Iniciado. Esperando eventos...', type: 'info' }]);
    setSecurityStatus('SECURE');
    setRiskScore(5);
    setActiveScenario('idle');
    setSelectedNode(null);
  };

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg, type }, ...prev].slice(0, 50));
  };

  // --- SIMULACIÓN 1: ACTIVIDAD NORMAL ---
  const simulateNormalActivity = () => {
    if (activeScenario !== 'idle') return;
    setActiveScenario('normal');
    addLog('Detectando tráfico entrante...', 'info');

    addTimeout(() => {
      const ipNode = { 
        id: 'ip1', type: 'ip_safe', label: 'IP: 190.x (Montería)', x: 450, y: 250, icon: MapPin,
        data: { isp: 'Tigo UNE', pais: 'Colombia', ciudad: 'Montería', reputacion: 'Segura' }
      };
      setNodes(prev => [...prev, ipNode]);
      setLinks(prev => [...prev, { source: 'a1', target: 'ip1', label: 'LOGIN_OK', status: 'success', animated: true }]);
      addLog('Conexión autorizada: Usuario local detectado.', 'success');
      setRiskScore(10);

      addTimeout(() => {
        const resNode = { 
          id: 'r1', type: 'resource', label: 'Plataforma Moodle', x: 650, y: 250, icon: Server,
          data: { tipo: 'Web Server', ip_interna: '10.0.0.55', sensibilidad: 'Media' }
        };
        setNodes(prev => [...prev, resNode]);
        setLinks(prev => [...prev, { source: 'ip1', target: 'r1', label: 'ACCESO_CURSOS', status: 'normal', animated: true }]);
        addLog('Sesión establecida en Moodle. Comportamiento normal.', 'success');
        setActiveScenario('idle');
      }, 1500);
    }, 1000);
  };

  // --- SIMULACIÓN 2: ATAQUE COMPLEXO (LATERAL MOVEMENT) ---
  const simulateAttackChain = () => {
    if (activeScenario !== 'idle' && activeScenario !== 'normal') resetGraph();
    setActiveScenario('attack');
    setRiskScore(15);

    // 1. Contexto Previo (si no existe)
    if (!nodes.find(n => n.id === 'ip1')) {
      const ipSafe = { 
        id: 'ip1', type: 'ip_safe', label: 'IP: Montería (Hace 2h)', x: 450, y: 250, icon: MapPin,
        data: { isp: 'Tigo UNE', pais: 'Colombia' }
      };
      setNodes(prev => [...prev, ipSafe]);
      setLinks(prev => [...prev, { source: 'a1', target: 'ip1', label: 'LOGIN_PREVIO', status: 'normal' }]);
    }

    // 2. Intrusión Inicial
    addTimeout(() => {
      addLog('⚠️ TRÁFICO ANÓMALO DETECTADO', 'warning');
      const ipBad = { 
        id: 'ip_rus', type: 'ip_danger', label: 'IP: 185.x (Rusia)', x: 450, y: 450, icon: Globe,
        data: { isp: 'Unkown VPS Host', pais: 'Rusia', ciudad: 'Moscú', reputacion: 'MALICIOSA', blacklist: 'SpamHaus' }
      };
      setNodes(prev => [...prev, ipBad]);
      setLinks(prev => [...prev, { source: 'a1', target: 'ip_rus', label: 'LOGIN_EXITOSO', status: 'warning', dashed: true }]);
      setSecurityStatus('WARNING');
      setRiskScore(45);
      
      addLog('Análisis de Grafo: Calculando velocidad de viaje...', 'info');

      // 3. Detección de Viaje Imposible
      addTimeout(() => {
        setSecurityStatus('CRITICAL');
        setRiskScore(85);
        addLog('🚨 ALERTA: "Impossible Travel" (>9000km/h). Cuenta comprometida.', 'error');
        setLinks(prev => prev.map(l => l.target === 'ip_rus' ? { ...l, status: 'danger', label: 'COMPROMETIDA', animated: true } : l));

        // 4. Movimiento Lateral (El ataque intenta expandirse)
        addTimeout(() => {
          if (activeScenario === 'mitigated') return; // Si el usuario ya actuó, no seguir

          addLog('🛑 ALERTA CRÍTICA: Intento de Movimiento Lateral detectado.', 'error');
          const dbNode = { 
            id: 'db_fin', type: 'finance', label: 'Srv. Financiero', x: 700, y: 450, icon: DollarSign,
            data: { tipo: 'Base de Datos', ip_interna: '10.0.0.99', sensibilidad: 'ALTA/CRÍTICA', contenido: 'Nómina Docente' }
          };
          setNodes(prev => [...prev, dbNode]);
          setLinks(prev => [...prev, { source: 'ip_rus', target: 'db_fin', label: 'SQL_INJECTION', status: 'danger', animated: true }]);
          setRiskScore(98);

          addLog('ACCIÓN REQUERIDA: El atacante está tocando activos financieros. ¡BLOQUEE LA IP!', 'error');

        }, 3000); 

      }, 2000);
    }, 1500);
  };

  // --- ACCIONES DE MITIGACIÓN ---
  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const blockNode = (nodeId) => {
    if (!nodeId) return;
    
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, type: 'ip_blocked', label: 'BLOQUEADO', icon: XCircle } : n));
    setLinks(prev => prev.map(l => 
      (l.source === nodeId || l.target === nodeId) 
        ? { ...l, status: 'blocked', label: 'DENEGADO', animated: false, dashed: true } 
        : l
    ));

    setRiskScore(prev => Math.max(20, prev - 50));
    setSecurityStatus('WARNING'); 
    addLog(`🛡️ DEFENSA ACTIVA: Nodo ${nodeId} aislado manualmente por el operador.`, 'success');
    
    if (activeScenario === 'attack') {
      setActiveScenario('mitigated');
      addLog('Amenaza contenida. Movimiento lateral detenido.', 'success');
    }
  };

  return (
    <div className={`min-h-screen ${COLORS.background} ${COLORS.text} font-sans flex flex-col overflow-hidden relative`}>
      
      {/* HEADER TIPO SOC */}
      <header className="bg-slate-950 border-b border-slate-800 p-3 flex justify-between items-center shadow-2xl z-20">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600/20 p-2 rounded border border-blue-500/50">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest text-white">UNICÓRDOBA <span className="text-blue-500">SOC-VIEW</span></h1>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SISTEMA DE GRAFOS EN LÍNEA
            </div>
          </div>
        </div>

        {/* METRICS BAR */}
        <div className="flex gap-8 px-8 border-l border-r border-slate-800">
          <div className="text-center hidden md:block">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Estado de Amenaza</div>
            <div className={`font-mono font-bold text-lg ${
              securityStatus === 'SECURE' ? 'text-emerald-400' : 
              securityStatus === 'WARNING' ? 'text-amber-400' : 'text-red-500 animate-pulse'
            }`}>
              {securityStatus}
            </div>
          </div>
          <div className="text-center hidden md:block">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Risk Score</div>
            <div className="flex items-center gap-2 font-mono font-bold text-lg">
               <span className={riskScore > 70 ? 'text-red-500' : riskScore > 30 ? 'text-amber-400' : 'text-emerald-400'}>
                 {riskScore}/100
               </span>
            </div>
            <div className="w-24 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
               <div className={`h-full transition-all duration-500 ${riskScore > 70 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${riskScore}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* BOTÓN EDUCATIVO */}
          <button 
            onClick={() => setShowEduPanel(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded border border-indigo-400 transition-all shadow-lg shadow-indigo-500/20 mr-2"
          >
            <BookOpen className="w-3 h-3" /> Explicación Técnica
          </button>

          <button onClick={resetGraph} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded border border-slate-700 transition-all">
            <RefreshCw className="w-3 h-3" /> Reiniciar
          </button>
        </div>
      </header>

      {/* BODY */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* --- CANVAS DEL GRAFO (IZQUIERDA) --- */}
        <div className="flex-1 relative bg-slate-900 overflow-hidden cursor-crosshair">
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ 
                 backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
               }}>
          </div>
          <div className="absolute bottom-4 left-4 text-slate-600 font-mono text-xs pointer-events-none">
            LAT: 8.7512 N | LON: 75.8784 W <br/> MONTERIA_NODE_01
          </div>

          <svg className="w-full h-full absolute inset-0 pointer-events-none z-0">
            <defs>
              <marker id="arrow-normal" markerWidth="6" markerHeight="6" refX="20" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#64748b" /></marker>
              <marker id="arrow-success" markerWidth="6" markerHeight="6" refX="20" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#10b981" /></marker>
              <marker id="arrow-danger" markerWidth="6" markerHeight="6" refX="20" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ef4444" /></marker>
            </defs>
            {links.map((link, i) => {
              const s = nodes.find(n => n.id === link.source);
              const t = nodes.find(n => n.id === link.target);
              if (!s || !t) return null;

              const color = link.status === 'danger' ? '#ef4444' : link.status === 'success' ? '#10b981' : link.status === 'blocked' ? '#334155' : '#64748b';
              const width = link.status === 'danger' ? 3 : 1.5;
              const marker = link.status === 'danger' ? 'url(#arrow-danger)' : link.status === 'success' ? 'url(#arrow-success)' : link.status === 'blocked' ? '' : 'url(#arrow-normal)';
              
              return (
                <g key={i}>
                  <line x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={color} strokeWidth={width} strokeDasharray={link.dashed ? '5,5' : '0'} markerEnd={marker} opacity={link.status === 'blocked' ? 0.3 : 1} />
                  {link.animated && link.status !== 'blocked' && (
                    <circle r="3" fill={color}>
                      <animateMotion dur="1.5s" repeatCount="indefinite" path={`M${s.x},${s.y} L${t.x},${t.y}`} />
                    </circle>
                  )}
                  <rect x={(s.x+t.x)/2 - 35} y={(s.y+t.y)/2 - 10} width="70" height="16" rx="4" fill="#0f172a" stroke={color} strokeWidth="1" />
                  <text x={(s.x+t.x)/2} y={(s.y+t.y)/2 + 2} textAnchor="middle" fill={color} fontSize="9" fontWeight="bold" className="font-mono tracking-tighter">
                    {link.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {nodes.map(node => {
            const Icon = node.icon;
            const isSelected = selectedNode?.id === node.id;
            let styleClass = COLORS.node[node.type] || 'bg-slate-600';
            if (node.type === 'ip_blocked') styleClass = 'bg-slate-700 ring-slate-600 grayscale';

            return (
              <div 
                key={node.id}
                onClick={() => handleNodeClick(node)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group transition-all duration-300 ${isSelected ? 'scale-110 z-20' : 'z-10'}`}
                style={{ left: node.x, top: node.y }}
              >
                {isSelected && <div className="absolute inset-0 rounded-full animate-ping bg-white/20"></div>}
                <div className={`w-12 h-12 rounded-full shadow-xl flex items-center justify-center ring-2 ring-offset-2 ring-offset-slate-900 transition-colors ${styleClass} ${isSelected ? 'ring-white' : ''}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`mt-2 px-2 py-0.5 rounded text-[10px] font-bold border backdrop-blur-md transition-colors ${
                  isSelected ? 'bg-slate-700 border-white text-white' : 'bg-slate-900/80 border-slate-600 text-slate-300 group-hover:border-slate-400'
                }`}>
                  {node.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- PANEL DE CONTROL LATERAL (DERECHA) --- */}
        <div className="w-96 bg-slate-950 border-l border-slate-800 flex flex-col z-20 shadow-xl">
          
          {/* INSPECTOR */}
          <div className="h-1/3 border-b border-slate-800 p-4 bg-slate-900/50">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Search className="w-3 h-3" /> Inspector de Entidad
            </h2>
            
            {selectedNode ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${COLORS.node[selectedNode.type]?.split(' ')[0] || 'bg-slate-600'}`}>
                    <selectedNode.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{selectedNode.label}</div>
                    <div className="text-xs text-slate-400 font-mono">{selectedNode.id.toUpperCase()}</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {selectedNode.data && Object.entries(selectedNode.data).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-xs border-b border-slate-800 pb-1">
                      <span className="text-slate-500 capitalize">{key.replace('_', ' ')}:</span>
                      <span className={`font-mono ${val === 'MALICIOSA' || val === 'ALTA/CRÍTICA' ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                        {val}
                      </span>
                    </div>
                  ))}
                </div>

                {(selectedNode.type === 'ip_danger' || selectedNode.type === 'finance') && (
                  <button 
                    onClick={() => blockNode(selectedNode.id)}
                    className="w-full py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-900/20"
                  >
                    <XCircle className="w-4 h-4" /> 
                    {selectedNode.type === 'finance' ? 'AISLAR SERVIDOR' : 'BLOQUEAR IP MALICIOSA'}
                  </button>
                )}
                {selectedNode.type === 'ip_blocked' && (
                  <div className="text-center text-xs text-slate-500 py-2 border border-slate-700 rounded border-dashed">
                    Este nodo ha sido neutralizado.
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
                <Activity className="w-8 h-8 opacity-20" />
                <p className="text-xs">Seleccione un nodo en el mapa<br/>para ver inteligencia y acciones.</p>
              </div>
            )}
          </div>

          {/* SIMULACIONES */}
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Ejecutar Escenarios</h2>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={simulateNormalActivity}
                disabled={activeScenario !== 'idle'}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded flex flex-col items-center gap-2 text-xs font-semibold text-emerald-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Unlock className="w-5 h-5" />
                Tráfico Legítimo
              </button>
              <button 
                onClick={simulateAttackChain}
                disabled={activeScenario !== 'idle'}
                className="p-3 bg-slate-800 hover:bg-red-900/20 border border-slate-700 hover:border-red-500/50 rounded flex flex-col items-center gap-2 text-xs font-semibold text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <AlertTriangle className="w-5 h-5" />
                Ataque APT
              </button>
            </div>
            {activeScenario === 'attack' && (
              <div className="mt-3 text-[10px] bg-red-500/10 text-red-400 p-2 rounded border border-red-500/20 text-center animate-pulse">
                ⚠ ATAQUE EN CURSO - REQUIERE INTERVENCIÓN
              </div>
            )}
          </div>

          {/* LOGS */}
          <div className="flex-1 flex flex-col overflow-hidden bg-black/20">
            <div className="p-2 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Live Security Logs</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-[10px] custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className={`p-1.5 border-l-2 rounded bg-slate-900/50 ${
                  log.type === 'error' ? 'border-red-500 text-red-300' :
                  log.type === 'warning' ? 'border-amber-500 text-amber-300' :
                  log.type === 'success' ? 'border-emerald-500 text-emerald-300' :
                  'border-blue-500 text-blue-300'
                }`}>
                  <span className="opacity-40 mr-2">{log.time}</span>
                  {log.msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL EDUCATIVO --- */}
      {showEduPanel && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Arquitectura de Grafos: Análisis Técnico</h2>
              </div>
              <button onClick={() => setShowEduPanel(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 text-slate-300">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                  <h3 className="text-indigo-400 font-bold mb-2 flex items-center gap-2"><Info className="w-4 h-4"/> 1. El Modelo de Nodos</h3>
                  <p className="text-sm leading-relaxed">
                    A diferencia de una base de datos SQL que usa tablas rígidas, aquí usamos <strong>Nodos</strong> para representar entidades reales de la Universidad:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-xs space-y-1 text-slate-400">
                    <li><strong className="text-blue-400">Usuario:</strong> Docentes/Estudiantes.</li>
                    <li><strong className="text-emerald-400">IP:</strong> Ubicación digital.</li>
                    <li><strong className="text-amber-400">Recurso:</strong> Bases de datos (Notas, Nómina).</li>
                  </ul>
                </div>
                
                <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                  <h3 className="text-indigo-400 font-bold mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> 2. Patrón de "Viaje Imposible"</h3>
                  <p className="text-sm leading-relaxed">
                    El sistema no mira cada login aislado. Mira la <strong>relación temporal</strong> entre nodos.
                  </p>
                  <div className="mt-2 bg-slate-900 p-2 rounded text-xs font-mono text-emerald-300 border border-slate-700">
                    Velocidad = Distancia(NodoA, NodoB) / (TiempoB - TiempoA)
                  </div>
                  <p className="text-xs mt-2 text-slate-400">
                    Si Velocidad &gt; 900km/h, el grafo crea una arista de <strong>ALERTA</strong> instantáneamente.
                  </p>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                <h3 className="text-indigo-400 font-bold mb-2 flex items-center gap-2"><Cpu className="w-4 h-4"/> 3. Detección de Movimiento Lateral</h3>
                <p className="text-sm leading-relaxed mb-2">
                  Los atacantes no se quedan en la puerta. Saltan de un sistema a otro. Los grafos son excelentes para detectar estos caminos (Paths).
                </p>
                <div className="flex items-center gap-4 text-xs font-mono bg-slate-900 p-3 rounded border border-slate-700 overflow-x-auto">
                  <span className="text-red-400">IP_Rusia</span>
                  <span className="text-slate-500">--[ACCEDE]--&gt;</span>
                  <span className="text-violet-400">Cuenta_Profe</span>
                  <span className="text-slate-500">--[MODIFICA]--&gt;</span>
                  <span className="text-pink-400">DB_Nómina</span>
                </div>
                <p className="text-xs mt-2 text-slate-400">
                  El sistema detecta que hay un camino (Path) activo desde un nodo malicioso (Rusia) hasta un nodo crítico (Nómina) y sugiere cortar la arista inmediatamente.
                </p>
              </div>

              <div className="bg-blue-900/20 p-4 rounded border border-blue-500/30">
                <h4 className="font-bold text-blue-400 mb-1">¿Por qué esto ayuda a la Universidad de Córdoba?</h4>
                <p className="text-sm text-blue-200">
                  Permite pasar de una defensa reactiva (revisar logs después del robo) a una defensa <strong>predictiva y visual</strong>. Los administradores pueden ver la forma del ataque y aislar solo las ramas afectadas del grafo sin apagar toda la red.
                </p>
              </div>

            </div>
            
            <div className="p-4 bg-slate-900 border-t border-slate-700 flex justify-end">
              <button 
                onClick={() => setShowEduPanel(false)}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}