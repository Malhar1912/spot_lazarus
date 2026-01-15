import { useState, useEffect, useRef } from 'react';
import { X, Minus, Square, Terminal } from 'lucide-react';

interface Props {
    onClose: () => void;
}

export default function TerminalWindow({ onClose }: Props) {
    const [history, setHistory] = useState<string[]>(['Welcome to Spot Lazarus Instance v1.0.4', 'Type "help" for available commands.']);
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd: string) => {
        const trimmed = cmd.trim().toLowerCase();
        let output: string[] = [];

        switch (trimmed) {
            case 'help':
                output = [
                    'Available commands:',
                    '  ls           List directory contents',
                    '  whoami       Print effective user ID',
                    '  top          Display system processes',
                    '  docker ps    List containers',
                    '  uptime       Show how long system has been running',
                    '  exit         Close terminal session'
                ];
                break;
            case 'ls':
                output = [
                    'drwxr-xr-x  4 root root  4096 Jan 15 09:01 .',
                    'drwxr-xr-x 20 root root  4096 Jan 14 22:15 ..',
                    '-rw-r--r--  1 app  app    542 Jan 15 08:30 .env',
                    '-rw-r--r--  1 app  app   1204 Jan 15 08:30 package.json',
                    'drwxr-xr-x  1 app  app    128 Jan 15 08:31 src',
                    'drwxr-xr-x  1 app  app     64 Jan 15 08:31 node_modules'
                ];
                break;
            case 'whoami':
                output = ['root'];
                break;
            case 'uptime':
                output = [' 09:38:12 up 4 min,  1 user,  load average: 0.12, 0.08, 0.05'];
                break;
            case 'docker ps':
                output = [
                    'CONTAINER ID   IMAGE          COMMAND        CREATED         STATUS         PORTS                    NAMES',
                    '8f4a1b2c3d4e   node:18        "npm start"    4 minutes ago   Up 4 minutes   0.0.0.0:3000->3000/tcp   web-app',
                    '1a2b3c4d5e6f   redis:alpine   "redis-server" 4 minutes ago   Up 4 minutes   6379/tcp                 redis-cache'
                ];
                break;
            case 'top':
                output = ['%Cpu(s):  4.2 us,  1.2 sy,  0.0 ni, 94.6 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st'];
                break;
            case 'exit':
                onClose();
                return;
            case '':
                break;
            default:
                output = [`zsh: command not found: ${trimmed}`];
        }

        setHistory(prev => [...prev, `root@spot-lazarus:~/app# ${cmd}`, ...output]);
        setInput('');
    };

    return (
        <div className="fixed bottom-10 right-10 w-[600px] h-[400px] bg-black/90 backdrop-blur-md text-green-400 font-mono text-sm rounded-lg shadow-2xl border border-zinc-700 flex flex-col overflow-hidden z-[60]">
            {/* Title Bar */}
            <div className="bg-zinc-800 px-3 py-2 flex items-center justify-between select-none">
                <div className="flex items-center gap-2 text-zinc-400">
                    <Terminal size={14} />
                    <span className="text-xs">root@spot-lazarus:~/app</span>
                </div>
                <div className="flex items-center gap-2">
                    <Minus size={14} className="text-zinc-500 hover:text-white cursor-pointer" />
                    <Square size={12} className="text-zinc-500 hover:text-white cursor-pointer" />
                    <X size={14} className="text-zinc-500 hover:text-red-500 cursor-pointer" onClick={onClose} />
                </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 overflow-y-auto cursor-text" onClick={() => document.getElementById('term-input')?.focus()}>
                {history.map((line, i) => (
                    <div key={i} className="mb-1 whitespace-pre-wrap">{line}</div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-blue-400">root@spot-lazarus:~/app#</span>
                    <input
                        id="term-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
                        className="bg-transparent border-none outline-none flex-1 text-green-400 caret-green-400"
                        autoFocus
                        autoComplete="off"
                    />
                </div>
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
