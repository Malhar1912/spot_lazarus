import { useState, useEffect, useRef, KeyboardEvent } from 'react';
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
        const trimmed = cmd.trim();
        const [baseCmd, ...args] = trimmed.split(' ');
        let output: string[] = [];

        switch (baseCmd.toLowerCase()) {
            case 'help':
                output = [
                    'Available commands:',
                    '  ls                 List directory contents',
                    '  whoami             Print effective user ID',
                    '  top                Display system processes',
                    '  docker ps          List containers',
                    '  uptime             Show how long system has been running',
                    '  df -h              Show disk space usage',
                    '  free -m            Show memory usage',
                    '  cat <file>         Concatenate and print files',
                    '  clear              Clear terminal',
                    '  exit               Close terminal session'
                ];
                break;
            case 'ls':
                output = [
                    'drwxr-xr-x  4 root root  4096 Jan 15 09:01 .',
                    'drwxr-xr-x 20 root root  4096 Jan 14 22:15 ..',
                    '-rw-r--r--  1 app  app    542 Jan 15 08:30 .env',
                    '-rw-r--r--  1 app  app   1204 Jan 15 08:30 package.json',
                    'drwxr-xr-x  1 app  app    128 Jan 15 08:31 src',
                    'drwxr-xr-x  1 app  app     64 Jan 15 08:31 node_modules',
                    '-rw-r--r--  1 root root   392 Jan 14 22:15 /etc/os-release'
                ];
                break;
            case 'whoami':
                output = ['root'];
                break;
            case 'uptime':
                output = [' 09:38:12 up 4 min,  1 user,  load average: 0.12, 0.08, 0.05'];
                break;
            case 'docker':
                if (args[0] === 'ps') {
                    output = [
                        'CONTAINER ID   IMAGE          COMMAND        CREATED         STATUS         PORTS                    NAMES',
                        '8f4a1b2c3d4e   node:18        "npm start"    4 minutes ago   Up 4 minutes   0.0.0.0:3000->3000/tcp   web-app',
                        '1a2b3c4d5e6f   redis:alpine   "redis-server" 4 minutes ago   Up 4 minutes   6379/tcp                 redis-cache'
                    ];
                } else {
                    output = ['docker: missing command. See \'docker --help\'.'];
                }
                break;
            case 'top':
                // Creating a realistic top simulation block
                output = [
                    'top - 14:02:51 up 4 min,  1 user,  load average: 0.42, 0.35, 0.18',
                    'Tasks:  94 total,   2 running,  92 sleeping,   0 stopped,   0 zombie',
                    '%Cpu(s):  4.2 us,  1.2 sy,  0.0 ni, 94.6 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st',
                    'MiB Mem :   7952.4 total,    824.2 free,   4021.5 used,   3106.7 buff/cache',
                    '',
                    '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
                    ' 1337 root      20   0 1284592 418244  32948 S   4.2   5.1   0:14.32 node',
                    '    1 root      20   0  168420  12488   8924 S   0.0   0.2   0:01.05 systemd'
                ];
                break;
            case 'df':
                if (args[0] === '-h') {
                    output = [
                        'Filesystem      Size  Used Avail Use% Mounted on',
                        '/dev/xvda1       20G   14G  5.2G  73% /',
                        'tmpfs           3.9G     0  3.9G   0% /dev/shm',
                        '/dev/xvdf       100G   45G   55G  45% /data'
                    ];
                } else {
                    output = ['Filesystem     1K-blocks      Used Available Use% Mounted on', '/dev/xvda1      20971520  14680064   5242880  73% /'];
                }
                break;
            case 'free':
                if (args[0] === '-m') {
                    output = [
                        '              total        used        free      shared  buff/cache   available',
                        'Mem:           7952        4021         824         124        3106        3592',
                        'Swap:             0           0           0'
                    ];
                } else {
                    output = ['              total        used        free      shared  buff/cache   available', 'Mem:        8143256     4117504      843776      126976     3181976     3678208'];
                }
                break;
            case 'cat': {
                const file = args[0];
                if (file === '/etc/os-release') {
                    output = [
                        'PRETTY_NAME="Ubuntu 22.04.3 LTS"',
                        'NAME="Ubuntu"',
                        'VERSION_ID="22.04"',
                        'VERSION="22.04.3 LTS (Jammy Jellyfish)"',
                        'ID=ubuntu',
                        'ID_LIKE=debian'
                    ];
                } else if (file === '.env') {
                    output = ['PORT=3000', 'NODE_ENV=production', 'DB_HOST=10.0.1.42', 'REDIS_URL=redis://localhost:6379'];
                } else if (!file) {
                    output = ['cat: missing operand'];
                } else {
                    output = [`cat: ${file}: No such file or directory`];
                }
                break;
            }
            case 'clear':
                setHistory([]);
                setInput('');
                return; // Early return to avoid adding "clear" to history text
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

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCommand(input);
        }
        // Basic Tab Completion
        if (e.key === 'Tab') {
            e.preventDefault();
            const knownCmds = ['help', 'ls', 'whoami', 'top', 'docker', 'uptime', 'df', 'free', 'cat', 'clear', 'exit'];
            const matches = knownCmds.filter(c => c.startsWith(input));
            if (matches.length === 1) {
                setInput(matches[0]);
            }
        }
    };

    return (
        <div className="fixed bottom-10 right-10 w-[600px] h-[400px] bg-black/95 backdrop-blur-md text-green-400 font-mono text-sm rounded-lg shadow-2xl border border-zinc-700 flex flex-col overflow-hidden z-[60]">
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
            <div className="flex-1 p-4 overflow-y-auto cursor-text scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900" onClick={() => document.getElementById('term-input')?.focus()}>
                {history.map((line, i) => (
                    <div key={i} className="mb-1 whitespace-pre-wrap leading-relaxed">{line}</div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-blue-400 font-bold">root@spot-lazarus:~/app#</span>
                    <input
                        id="term-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent border-none outline-none flex-1 text-green-400 caret-green-400 p-0 m-0"
                        autoFocus
                        autoComplete="off"
                    />
                </div>
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
