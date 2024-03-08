#!/bin/bash

# Redis 노드가 시작되고 서비스가 완전히 준비되기를 기다린다.
sleep 1

redis-cli --cluster call master1:8000 flushall
redis-cli --cluster call master1:8000 cluster reset

# 마스터 설정하기
echo "yes" | redis-cli --cluster create master1:8000 master2:8001 master3:8002

# 슬레이브 등록하기
echo "yes" | redis-cli --cluster add-node slave1:8100 master1:8000 --cluster-slave
echo "yes" | redis-cli --cluster add-node slave2:8101 master2:8001 --cluster-slave
echo "yes" | redis-cli --cluster add-node slave3:8102 master3:8002 --cluster-slave

# 노드만 만들고 클러스터 구성 안 한 상태로 Master-slave 한번에 구성하기
#echo "yes" | redis-cli --cluster create master1:8000 master2:8001 master3:8002 slave1:8100 slave2:8101 slave3:8102 --cluster-replicas 1

# 클러스터 정보 확인
redis-cli --cluster check master1:8000

# redis-stat
#java -jar redis-stat-0.4.14.jar localhost:8000 localhost:8001 localhost:8002 localhost:8100 localhost:8101 localhost:8102 --server=8888